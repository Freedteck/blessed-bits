/*
/// Module: blessedbits_contract
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module blessedbits_contract::blessedbits;
use std::string::{String, utf8}; 
use sui::coin::{Self, Coin, TreasuryCap}; 
use sui::event; use sui::dynamic_field; 
use sui::bag::{Self, Bag}; 
use sui::clock::{Self, Clock}; 
use sui::vec_map::{Self, VecMap};
use sui::clock::timestamp_ms;
use sui::balance::{Balance, Self};
use sui::sui::SUI;

// ====== ERROR CONSTANTS ======
const ENotOwner: u64 = 0;
const EInsufficientBalance: u64 = 1;
const EAlreadyVoted: u64 = 3;
const ENotCreator: u64 = 4;
const EUserExists: u64 = 5;
const EUserNotFound: u64 = 6;
const ECashbackAlreadyClaimed: u64 = 7;
const EBadgeNotFound: u64 = 8;
const ETipToSelf: u64 = 9;
const EProfileNotUpdated: u64 = 10;
const EInsufficientVoteFee: u64 = 11;
const EPurchaseTooSmall: u64 = 12;

// ====== CONSTANTS FOR ======
const DAILY_CASHBACK_AMOUNT: u64 = 10; // 10 $BLESS per day
const MILLISECONDS_PER_DAY: u64 = 86400000; // 24 hours in milliseconds
const MIN_PURCHASE_AMOUNT: u64 = 100; // Minimum $BLESS purchase
const BLESS_PER_SUI: u64 = 10000; // 10,000 $BLESS per 1 SUI (0.1 SUI = 1,000 $BLESS)

// ====== STRUCTS ======
public struct BLESSEDBITS has drop {}

public struct UserProfile has key, store {
    id: UID,
    username: String,
    bio: String,
    join_date: u64,
    followers: vector<address>,
    following: vector<address>,
    staked: Balance<BLESSEDBITS>,
    staked_amount: u64,
    voting_power: u64,
    videos_uploaded: u64,
    last_cashback_claim: u64,
    total_cashback_claimed: u64,
}

public struct Video has key, store {
    id: UID,
    creator: address,
    video_url: String,
    thumbnail_url: String,
    title: String,
    description: String,
    tags: vector<String>,
    likes: u64,
    dislikes: u64,
    total_rewards: u64,
    voters: VecMap<address, bool>,
    created_at: u64
}


public struct Badge has key, store {
    id: UID,
    badge_type: String,
    description: String,
    awarded_to: address,
    awarded_at: u64
}

public struct BadgeCollection has key {
    id: UID,
    badges: VecMap<ID, Badge>
}

public struct PlatformState has key {
    id: UID,
    video_count: u64,
    badge_count: u64,
    user_count: u64,
    videos: VecMap<ID, Video>, 
    badges: Bag,
    user_profiles: VecMap<address, UserProfile>,
    daily_rewards_pool: u64,
    last_distribution: u64,
    last_staking_distribution: u64,  // New field to track staking distributions
    total_staked: u64                // New field to track total staked tokens
}

// ====== EVENTS ======
public struct UserRegistered has copy, drop {
    user_address: address,
    username: String,
    timestamp: u64
}

public struct VideoUploaded has copy, drop {
    video_id: ID,
    creator: address,
    video_url: String,
    thumbnail_url: String,
    title: String,
    timestamp: u64
}

public struct VoteCast has copy, drop {
    video_id: ID,
    voter: address,
    is_like: bool,
    reward_distributed: u64,
    voting_power_used: u64
}

public struct BadgeAwarded has copy, drop {
    badge_id: ID,
    recipient: address,
    badge_type: String,
    timestamp: u64
}

public struct TokensStaked has copy, drop {
    user: address,
    amount: u64,
    new_voting_power: u64
}

public struct TokensClaimed has copy, drop {
    claimer: address,
    amount: u64,
    timestamp: u64
}

public struct FollowAction has copy, drop {
    follower: address,
    following: address,
    is_follow: bool // true=follow, false=unfollow
}

public struct TipSent has copy, drop {
    sender: address,
    recipient: address,
    amount: u64,
    message: String,
    timestamp: u64
}

public struct ProfileUpdated has copy, drop {
    user: address,
    old_username: String,
    new_username: String,
    old_bio: String,
    new_bio: String,
    timestamp: u64
}

public struct ProfileFieldUpdated has copy, drop {
    user: address,
    field_updated: String,
    new_value: String,
    timestamp: u64
}

public struct CashbackClaimed has copy, drop {
    user: address,
    amount: u64,
    timestamp: u64
}

public struct TokensPurchased has copy, drop {
    user: address,
    bless_amount: u64,
    sui_paid: u64,
    timestamp: u64
}


public struct StakerRewardClaimed has copy, drop {
    user: address,
    amount: u64,
    timestamp: u64
}

// ====== INITIALIZATION ======
fun init(witness: BLESSEDBITS, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency<BLESSEDBITS>(
        witness,
        2, // decimals
        b"BLESS",
        b"BlessedBits Token",
        b"",
        option::none(),
        ctx
    );

    transfer::public_freeze_object(metadata);
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));

    let platform_state = PlatformState {
        id: object::new(ctx),
        video_count: 0,
        badge_count: 0,
        user_count: 0,
        videos: vec_map::empty(),
        badges: bag::new(ctx),
        user_profiles: vec_map::empty(),
        daily_rewards_pool: 100000, // 100,000 $BLESS daily pool
        last_distribution: 0,
        last_staking_distribution: 0, // Initialize new field
        total_staked: 0              // Initialize new field
    };

    transfer::share_object(platform_state);

    let badge_collection = BadgeCollection {
            id: object::new(ctx),
            badges: vec_map::empty()
        };
        transfer::share_object(badge_collection);
}

// ====== USER MANAGEMENT ======
public entry fun register_user(
    platform: &mut PlatformState,
    username: String,
    clock: &Clock,
    bio: String,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(!vec_map::contains(&platform.user_profiles, &sender), EUserExists);

    let user_profile = UserProfile {
            id: object::new(ctx),
            username,
            bio,
            join_date: timestamp_ms(clock),
            followers: vector::empty(),
            following: vector::empty(),
            staked: balance::zero<BLESSEDBITS>(),    // Initialize with zero balance
            staked_amount: 0,
            voting_power: 1,
            videos_uploaded: 0,
            last_cashback_claim: 0,
            total_cashback_claimed: 0
    };

    vec_map::insert(&mut platform.user_profiles, sender, user_profile);
    platform.user_count = platform.user_count + 1;

    event::emit(UserRegistered {
        user_address: sender,
        username: copy username,
        timestamp: timestamp_ms(clock),
    });
}

// ====== VIDEO FUNCTIONS ======
public entry fun upload_video(
    platform: &mut PlatformState,
    video_url: String,
    thumbnail_url: String,
    badge_collection: &mut BadgeCollection,
    title: String,
    description: String,
    tags: vector<String>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);

    // Create video object
    let video_id = object::new(ctx);
    let video_id_addr = object::uid_to_inner(&video_id);
    
    // Store in VecMap only (recommended approach)
    let video = Video {
        id: video_id,
        creator: sender,
        video_url: video_url,
        thumbnail_url: thumbnail_url,
        title: title,
        description: description,
        tags: tags,
        likes: 0,
        dislikes: 0,
        total_rewards: 0,
        voters: vec_map::empty(),
        created_at: timestamp_ms(clock),
    };

    vec_map::insert(&mut platform.videos, video_id_addr, video);
    platform.video_count = platform.video_count + 1;

    // Update user profile
    let user_profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    user_profile.videos_uploaded = user_profile.videos_uploaded + 1;

    check_achievements(platform, badge_collection, sender, clock, ctx);

    event::emit(VideoUploaded {
        video_id: video_id_addr,
        creator: sender,
        video_url: video_url,
        thumbnail_url: thumbnail_url,
        title: title,
        timestamp: timestamp_ms(clock),
    });
}

public entry fun delete_video(
    platform: &mut PlatformState,
    video_id: ID,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    let video = vec_map::get(&platform.videos, &video_id);
    assert!(video.creator == sender, ENotOwner);
    
    // Properly handle the removed video
    let (_, video) = vec_map::remove(&mut platform.videos, &video_id);
    let Video { id, .. } = video;
    object::delete(id);
    platform.video_count = platform.video_count - 1;
}

public entry fun refresh_daily_pool(
    platform: &mut PlatformState,
    clock: &Clock
) {
    let current_time = clock::timestamp_ms(clock);
    if (current_time - platform.last_distribution > MILLISECONDS_PER_DAY) { // 24h
        // Base amount + whatever was accumulated from purchases/tips
        platform.daily_rewards_pool = 100000 + platform.daily_rewards_pool;
        platform.last_distribution = current_time;
    }
}

public entry fun update_profile(
    platform: &mut PlatformState,
    new_username: String,
    new_bio: String,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);
    
    let profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    
    // Check if changes actually exist
    assert!(
        profile.username != new_username || 
        profile.bio != new_bio, 
        EProfileNotUpdated
    );
    
    // Capture old values for event
    let old_username = profile.username;
    let old_bio = profile.bio;
    
    // Update fields
    profile.username = new_username;
    profile.bio = new_bio;
    
    event::emit(ProfileUpdated {
        user: sender,
        old_username,
        new_username: copy new_username,
        old_bio,
        new_bio: copy new_bio,
        timestamp: clock::timestamp_ms(clock)
    });
}

public entry fun update_username(
    platform: &mut PlatformState,
    new_username: String,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);

    let profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    profile.username = new_username;

    event::emit(ProfileFieldUpdated {
        user: sender,
        field_updated: utf8(b"username"),
        new_value: copy new_username,
        timestamp: clock::timestamp_ms(clock)
    });
}

public entry fun update_bio(
    platform: &mut PlatformState,
    new_bio: String,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);

    let profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    profile.bio = new_bio;

    event::emit(ProfileFieldUpdated {
        user: sender,
        field_updated: utf8(b"bio"),
        new_value: copy new_bio,
        timestamp: clock::timestamp_ms(clock)
    });
}

// ====== CASHBACK MECHANISM ======
public entry fun claim_daily_cashback(
    platform: &mut PlatformState,
    treasury_cap: &mut TreasuryCap<BLESSEDBITS>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);
    
    let user_profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    let current_time = clock::timestamp_ms(clock);
    
    // Check if 24 hours have passed since last claim
    assert!(current_time - user_profile.last_cashback_claim >= MILLISECONDS_PER_DAY, ECashbackAlreadyClaimed);
    
    // Mint cashback tokens
    let cashback_tokens = coin::mint(treasury_cap, DAILY_CASHBACK_AMOUNT, ctx);
    
    // Update user profile
    user_profile.last_cashback_claim = current_time;
    user_profile.total_cashback_claimed = user_profile.total_cashback_claimed + DAILY_CASHBACK_AMOUNT;
    
    // Transfer tokens to user
    transfer::public_transfer(cashback_tokens, sender);
    
    event::emit(CashbackClaimed {
        user: sender,
        amount: DAILY_CASHBACK_AMOUNT,
        timestamp: current_time
    });
}

// ====== PURCHASE BLESS ======
public entry fun purchase_tokens(
    platform: &mut PlatformState,
    treasury_cap: &mut TreasuryCap<BLESSEDBITS>,
    mut payment: Coin<SUI>,
    bless_amount: u64,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);
    assert!(bless_amount >= MIN_PURCHASE_AMOUNT, EPurchaseTooSmall);
    
    // Calculate SUI cost (with proper rounding up)
    let sui_cost = (bless_amount + BLESS_PER_SUI - 1) / BLESS_PER_SUI;
    assert!(coin::value(&payment) >= sui_cost, EInsufficientBalance);
    
    // Split the payment if needed
    if (coin::value(&payment) > sui_cost) {
        let excess_amount = coin::value(&payment) - sui_cost;
        let change = coin::split(&mut payment, excess_amount, ctx);
        transfer::public_transfer(change, sender);
    };
    
    // Transfer SUI to platform treasury (or specific address)
    transfer::public_transfer(payment, tx_context::sender(ctx)); // Or platform treasury address
    
    // Calculate amount for daily reward pool (20% of purchase)
    let pool_contribution = (bless_amount * 20) / 100; // 20% goes to reward pool
    
    // Update daily rewards pool
    platform.daily_rewards_pool = platform.daily_rewards_pool + pool_contribution;
    
    // Mint $BLESS tokens and transfer to user
    let bless_tokens = coin::mint(treasury_cap, bless_amount, ctx);
    transfer::public_transfer(bless_tokens, sender);
    
    event::emit(TokensPurchased {
        user: sender,
        bless_amount,
        sui_paid: sui_cost,
        timestamp: clock::timestamp_ms(clock)
    });
}

// ====== VOTING & REWARDS ======
public entry fun vote(
    platform: &mut PlatformState,
    video_id: ID,
    is_like: bool,
    mut tokens: Coin<BLESSEDBITS>,  // User pays fee with these tokens
    treasury_cap: &mut TreasuryCap<BLESSEDBITS>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);

    let video: &mut Video = dynamic_field::borrow_mut(&mut platform.id, video_id);
    assert!(!vec_map::contains(&video.voters, &sender), EAlreadyVoted);
    assert!(video.creator != sender, ENotCreator); // Can't vote on own video

    // Check vote fee
    let vote_fee = 1; // 1 $BLESS per vote
    assert!(coin::value(&tokens) >= vote_fee, EInsufficientVoteFee);
    
    // Split fees if needed
    if (coin::value(&tokens) > vote_fee) {
        let change_amount = coin::value(&tokens) - vote_fee;
        let change = coin::split(&mut tokens, change_amount, ctx);
        transfer::public_transfer(change, sender);
    };
    
    // Split the vote fee: 50% burned, 50% to creator
    let creator_share = coin::split(&mut tokens, vote_fee / 2, ctx);
    
    // Burn the remaining tokens (50%)
    let burn_coins = tokens;
    coin::burn(treasury_cap, burn_coins);
    
    // Send creator share
    transfer::public_transfer(creator_share, video.creator);

    // Update user voting power and apply vote
    let user_profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    let voting_power = user_profile.voting_power;

    if (is_like) {
        video.likes = video.likes + voting_power;
    } else {
        video.dislikes = video.dislikes + voting_power;
    };

    // Distribute rewards from pool (only for likes)
    let reward_amount = if (is_like) { voting_power } else { 0 };
    if (reward_amount > 0 && platform.daily_rewards_pool >= reward_amount) {
        let tokens = coin::mint(treasury_cap, reward_amount, ctx);
        video.total_rewards = video.total_rewards + reward_amount;
        platform.daily_rewards_pool = platform.daily_rewards_pool - reward_amount;
        transfer::public_transfer(tokens, video.creator);
    };

    vec_map::insert(&mut video.voters, sender, is_like);

    event::emit(VoteCast {
        video_id,
        voter: sender,
        is_like,
        reward_distributed: reward_amount,
        voting_power_used: voting_power
    });
}


// ====== STAKING MECHANISM ======
public entry fun stake_tokens(
    platform: &mut PlatformState,
    tokens: Coin<BLESSEDBITS>,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);
    
    let amount = coin::value(&tokens);
    assert!(amount > 0, EInsufficientBalance);

    let user_profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    
    // Hold the staked coins
    coin::put(&mut user_profile.staked, tokens);
    
    // Update total staked amount for platform
    platform.total_staked = platform.total_staked + amount;
    
    // Update user's staked amount
    user_profile.staked_amount = user_profile.staked_amount + amount;

    // Recalculate voting power based on total stake (1 per 10 tokens)
    user_profile.voting_power = user_profile.staked_amount / 10;
    
    event::emit(TokensStaked {
        user: sender,
        amount,
        new_voting_power: user_profile.voting_power
    });
}

public entry fun unstake_tokens(
    platform: &mut PlatformState,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);

    let user_profile = vec_map::get_mut(&mut platform.user_profiles, &sender);
    let amount = user_profile.staked_amount;
    assert!(amount > 0, EInsufficientBalance);

    // Update total staked amount for platform
    platform.total_staked = platform.total_staked - amount;

    // Withdraw all staked coins
    let coins = coin::take(&mut user_profile.staked, amount, ctx);

    // Reset staked amount and voting power
    user_profile.staked_amount = 0;
    user_profile.voting_power = 1; // Default voting power of 1

    // Transfer coins back to user
    transfer::public_transfer(coins, sender);

    event::emit(TokensClaimed {
        claimer: sender,
        amount,
        timestamp: timestamp_ms(clock)
    });
}

// ===== TIPPING MECHANISM ======
public entry fun send_tip(
    platform: &mut PlatformState,
    recipient: address,
    amount: u64,
    message: String,
    treasury_cap: &mut TreasuryCap<BLESSEDBITS>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(sender != recipient, ETipToSelf);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);
    assert!(vec_map::contains(&platform.user_profiles, &recipient), EUserNotFound);
    assert!(amount > 0, EInsufficientBalance);

    // Calculate amount for daily reward pool (20% of tip)
    let pool_contribution = (amount * 20) / 100; // 20% goes to reward pool
    
    // Update daily rewards pool
    platform.daily_rewards_pool = platform.daily_rewards_pool + pool_contribution;
    
    // Mint and transfer tokens to recipient
    let tokens = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(tokens, recipient);

    event::emit(TipSent {
        sender,
        recipient,
        amount,
        message: copy message,
        timestamp: clock::timestamp_ms(clock)
    });
}

// ====== BADGE SYSTEM ======
public entry fun award_badge(
    badge_collection: &mut BadgeCollection,
    badge_type: String,
    description: String,
    recipient: address,
    clock: &Clock,
    ctx: &mut TxContext
) {
    assert!(!has_badge(badge_collection, recipient, copy badge_type), EBadgeNotFound);

    let badge_id = object::new(ctx);
    let inner_id = object::uid_to_inner(&badge_id);
    let badge = Badge {
        id: badge_id,
        badge_type: copy badge_type,
        description: copy description,
        awarded_to: recipient,
        awarded_at: clock::timestamp_ms(clock)
    };

    vec_map::insert(&mut badge_collection.badges, inner_id, badge);

    event::emit(BadgeAwarded {
        badge_id: inner_id,
        recipient,
        badge_type: copy badge_type,
        timestamp: clock::timestamp_ms(clock)
    });
}


public entry fun distribute_staker_rewards(
    platform: &mut PlatformState,
    treasury_cap: &mut TreasuryCap<BLESSEDBITS>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // First, check if it's time to distribute (once per day)
    let current_time = clock::timestamp_ms(clock);
    if (current_time - platform.last_staking_distribution < MILLISECONDS_PER_DAY) {
        // Not yet time to distribute
        return
    };
    
    // Check if there are any staked tokens
    if (platform.total_staked == 0) {
        // No one is staking, update timestamp and return
        platform.last_staking_distribution = current_time;
        return
    };
    
    // Calculate rewards (10% of daily pool)
    let rewards_to_distribute = (platform.daily_rewards_pool * 10) / 100;
    
    // Distribute rewards proportionally to each staker
    let user_addresses = vec_map::keys(&platform.user_profiles);
    let users_count = vector::length(&user_addresses);
    
    let mut i = 0;
    while (i < users_count) {
        let user_addr = *vector::borrow(&user_addresses, i);
        let user_profile = vec_map::get_mut(&mut platform.user_profiles, &user_addr);
        
        if (user_profile.staked_amount > 0) {
            // Calculate this user's share of rewards
            let user_reward = (rewards_to_distribute * user_profile.staked_amount) / platform.total_staked;
            
            if (user_reward > 0) {
                // Mint and transfer tokens to user
                let reward_tokens = coin::mint(treasury_cap, user_reward, ctx);
                transfer::public_transfer(reward_tokens, user_addr);
                
                // Emit event for staking rewards
                event::emit(StakerRewardClaimed {
                    user: user_addr,
                    amount: user_reward,
                    timestamp: current_time
                });
            };
        };
        
        i = i + 1;
    };
    
    // Update pool after distribution
    platform.daily_rewards_pool = platform.daily_rewards_pool - rewards_to_distribute;
    
    // Reset distribution time
    platform.last_staking_distribution = current_time;
}

// ====== SOCIAL FEATURES ======
public entry fun follow_user(
    platform: &mut PlatformState,
    user_to_follow: address,
    is_follow: bool,
    badge_collection: &mut BadgeCollection,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(vec_map::contains(&platform.user_profiles, &sender), EUserNotFound);
    assert!(vec_map::contains(&platform.user_profiles, &user_to_follow), EUserNotFound);

    if (is_follow) {
        add_follow_relationship(platform, sender, user_to_follow);
        check_achievements(
        platform,
        badge_collection,
        sender,
        clock,
        ctx
    );
    } else {
        remove_follow_relationship(platform, sender, user_to_follow);
    };

    event::emit(FollowAction {
        follower: sender,
        following: user_to_follow,
        is_follow
    });
}

// ====== HELPER FUNCTIONS ======
/// Internal function - Checks and awards badges automatically
fun check_achievements(
    platform: &PlatformState,          // Immutable ref (read-only)
    badge_collection: &mut BadgeCollection, // Mutable ref (for adding badges)
    user: address,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let user_profile = vec_map::get(&platform.user_profiles, &user);
    
    // (1) First Upload Badge
    if (user_profile.videos_uploaded == 1 && 
        !has_badge(badge_collection, user, utf8(b"FirstUpload"))) {
        award_badge(
            badge_collection,
            utf8(b"FirstUpload"), 
            utf8(b"Uploaded your first inspirational short"), 
            user,
            clock,
            ctx
        );
    };

    // (2) Top Creator Badge (100+ followers)
    if (vector::length(&user_profile.followers) >= 100 &&
       !has_badge(badge_collection, user, utf8(b"TopCreator"))) {
        award_badge(
            badge_collection,
            utf8(b"TopCreator"),
            utf8(b"Gained 100+ followers"),
            user,
            clock,
            ctx
        );
    };

    // (3) Consistency Badge (5+ videos)
    if (user_profile.videos_uploaded >= 5 &&
       !has_badge(badge_collection, user, utf8(b"Consistency"))) {
        award_badge(
            badge_collection,
            utf8(b"Consistency"),
            utf8(b"Uploaded 5+ inspirational shorts"),
            user,
            clock,
            ctx
        );
    };
    
    // (4) Faithful Creator Badge (30+ content)
    if (user_profile.videos_uploaded >= 30 &&
       !has_badge(badge_collection, user, utf8(b"FaithfulCreator"))) {
        award_badge(
            badge_collection,
            utf8(b"FaithfulCreator"),
            utf8(b"Uploaded 30+ inspirational shorts"),
            user,
            clock,
            ctx
        );
    };

    // (5) Blessed Creator Badge (1000+ BLESS Earned)

    // (6) Heartfelt Creator Badge (100+ likes)

    // (7) 1k Followers Badge (1000+ followers)
}


fun add_follow_relationship(
    platform: &mut PlatformState,
    follower: address,
    following: address
) {
    let user_profile = vec_map::get_mut(&mut platform.user_profiles, &follower);
    if (!vector::contains(&user_profile.following, &following)) {
        vector::push_back(&mut user_profile.following, following);
    };

    let target_profile = vec_map::get_mut(&mut platform.user_profiles, &following);
    if (!vector::contains(&target_profile.followers, &follower)) {
        vector::push_back(&mut target_profile.followers, follower);
    };
}


fun remove_follow_relationship(
    platform: &mut PlatformState,
    follower: address,
    following: address
) {
    // Remove from user's following list
    let user_profile = vec_map::get_mut(&mut platform.user_profiles, &follower);
    let (exists, index) = vector::index_of(&user_profile.following, &following);
    if (exists) {
        vector::remove(&mut user_profile.following, index);
        
        // Remove from target's followers list
        let target_profile = vec_map::get_mut(&mut platform.user_profiles, &following);
        let (exists, index) = vector::index_of(&target_profile.followers, &follower);
        if (exists) {
            vector::remove(&mut target_profile.followers, index);
        };
    };
}

public fun has_badge(
    badge_collection: &BadgeCollection,
    user: address,
    badge_type: String
): bool {
    let badge_ids = vec_map::keys(&badge_collection.badges);
    let len = vector::length(&badge_ids);
    let mut i = 0;
    
    while (i < len) {
        let badge_id = *vector::borrow(&badge_ids, i);
        let badge = vec_map::get(&badge_collection.badges, &badge_id);
        
        if (badge.awarded_to == user && badge.badge_type == badge_type) {
            return true;
        };
        i = i + 1;
    };
    false
}



// ====== VIEW FUNCTIONS ======
public fun get_followers(
    platform: &PlatformState,
    user: address
): vector<address> {
    // Return a copy of the followers vector
    *&vec_map::get(&platform.user_profiles, &user).followers
}

public fun get_following(
    platform: &PlatformState,
    user: address
): vector<address> {
    // Return a copy of the following vector
    *&vec_map::get(&platform.user_profiles, &user).following
}

public fun is_following(
    platform: &PlatformState,
    user: address,
    target: address
): bool {
    let user_profile = vec_map::get(&platform.user_profiles, &user);
    vector::contains(&user_profile.following, &target)
}


public fun get_video(platform: &PlatformState, video_id: ID): &Video {
    dynamic_field::borrow(&platform.id, video_id)
}

public fun get_badge_count(platform: &PlatformState): u64 {
    platform.badge_count
}

public fun get_video_count(platform: &PlatformState): u64 {
    platform.video_count
}