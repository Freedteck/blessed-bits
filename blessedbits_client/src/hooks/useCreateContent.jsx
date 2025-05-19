import { Transaction } from "@mysten/sui/transactions";
import useSubmitTransaction from "./useSubmitTransaction";
import { useGetCoin } from "./useGetCoin";
import { useCurrentAccount } from "@mysten/dapp-kit";

const useCreateContent = (
  packageId,
  platformStateId,
  suiClient,
  signAndExecute
) => {
  const { executeTransaction } = useSubmitTransaction(
    suiClient,
    signAndExecute
  );
  const { getBlessedCoin } = useGetCoin(packageId);
  const account = useCurrentAccount();

  const uploadVideo = async (
    videoUrl,
    thumbnail_url,
    badgeCollectionId,
    title,
    description,
    tags,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(videoUrl),
        tx.pure.string(thumbnail_url),
        tx.object(badgeCollectionId),
        tx.pure.string(title),
        tx.pure.string(description),
        tx.pure.vector("string", tags),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::upload_video`,
    });

    return executeTransaction(tx, {
      successMessage: "Video uploaded successfully!",
      errorMessage: "Error uploading video. Please try again.",
      loadingMessage: "Uploading video...",
      onSuccess,
    });
  };

  const deleteVideo = async (videoId, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(platformStateId), tx.object(videoId)],
      target: `${packageId}::blessedbits::delete_video`,
    });

    return executeTransaction(tx, {
      successMessage: "Video deleted successfully!",
      errorMessage: "Error deleting video. Please try again.",
      loadingMessage: "Deleting video...",
      onSuccess,
    });
  };

  const refreshDailyPool = async (onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(platformStateId), tx.object("0x6")],
      target: `${packageId}::blessedbits::refresh_daily_pool`,
    });

    return executeTransaction(tx, {
      successMessage: "Daily pool refreshed successfully!",
      errorMessage: "Error refreshing daily pool. Please try again.",
      loadingMessage: "Refreshing daily pool...",
      onSuccess,
    });
  };

  const registerUser = async (username, bio, treasuryId, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(username),
        tx.object("0x6"),
        tx.pure.string(bio),
      ],
      target: `${packageId}::blessedbits::register_user`,
    });

    // 2. Mint initial $BLESS tokens (1000 tokens)
    const [coin] = tx.moveCall({
      arguments: [
        tx.object(treasuryId),
        tx.pure.u64(1000), // Initial grant amount
      ],
      target: `0x2::coin::mint`,
      typeArguments: [`${packageId}::blessedbits::BLESSEDBITS`],
    });

    // Transfer to new user
    tx.transferObjects([coin], tx.pure.address(account?.address));

    return executeTransaction(tx, {
      successMessage:
        "Registration complete! You received 1000 $BLESS to get started",
      errorMessage: "Registration failed. Please try again.",
      loadingMessage: "Creating your account...",
      onSuccess,
    });
  };

  const updateProfile = async (newUserName, newBio, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(newUserName),
        tx.pure.string(newBio),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::update_profile`,
    });

    return executeTransaction(tx, {
      successMessage: "Profile updated successfully!",
      errorMessage: "Error updating profile. Please try again.",
      loadingMessage: "Updating profile...",
      onSuccess,
    });
  };

  const updateUsername = async (newUserName, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(newUserName),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::update_username`,
    });

    return executeTransaction(tx, {
      successMessage: "Username updated successfully!",
      errorMessage: "Error updating username. Please try again.",
      loadingMessage: "Updating username...",
      onSuccess,
    });
  };

  const updateBio = async (newBio, onSuccess) => {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.string(newBio),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::update_bio`,
    });
    return executeTransaction(tx, {
      successMessage: "Bio updated successfully!",
      errorMessage: "Error updating bio. Please try again.",
      loadingMessage: "Updating bio...",
      onSuccess,
    });
  };

  const vote = async (videoId, isLike, treasuryId, onSuccess) => {
    const tx = new Transaction();
    const coinObjectId = await getBlessedCoin();
    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.id(videoId),
        tx.pure.bool(isLike),
        tx.object(coinObjectId),
        tx.object(treasuryId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::vote`,
    });

    return executeTransaction(tx, {
      successMessage: "Vote submitted successfully!",
      errorMessage: "Error submitting vote. Please try again.",
      loadingMessage: "Submitting vote...",
      onSuccess,
    });
  };

  const sendReward = async (
    recipient,
    amount,
    message,
    treasuryId,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.address(recipient),
        tx.pure.u64(amount),
        tx.pure.string(message),
        tx.object(treasuryId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::send_tip`,
    });

    return executeTransaction(tx, {
      successMessage: "Reward sent successfully!",
      errorMessage: "Error sending reward. Please try again.",
      loadingMessage: "Sending reward...",
      onSuccess,
    });
  };

  const followUser = async (
    userToFollow,
    isFollow,
    badgeCollectionId,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.pure.address(userToFollow),
        tx.pure.bool(isFollow),
        tx.object(badgeCollectionId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::follow_user`,
    });

    return executeTransaction(tx, {
      successMessage: "Follow status updated successfully!",
      errorMessage: "Error updating follow status. Please try again.",
      loadingMessage: "Updating follow status...",
      onSuccess,
    });
  };

  const claimDailyCashback = async (treasuryId, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.object(treasuryId),
        tx.object("0x6"),
      ],
      target: `${packageId}::blessedbits::claim_daily_cashback`,
    });

    return executeTransaction(tx, {
      successMessage: "Daily cashback claimed successfully!",
      errorMessage: "Error claiming daily cashback. Please try again.",
      loadingMessage: "Claiming daily cashback...",
      onSuccess,
    });
  };

  /* ====== STAKING FUNCTIONS ====== */
  const stakeTokens = async (amount, onSuccess) => {
    const coinObjectId = await getBlessedCoin();
    const tx = new Transaction();

    const [stakeCoin] = tx.splitCoins(coinObjectId, [tx.pure.u64(amount)]);

    tx.moveCall({
      arguments: [tx.object(platformStateId), stakeCoin],
      target: `${packageId}::blessedbits::stake_tokens`,
    });

    return executeTransaction(tx, {
      successMessage: "Tokens staked successfully!",
      errorMessage: "Error staking tokens. Please try again.",
      loadingMessage: "Staking tokens...",
      onSuccess,
    });
  };

  const unstakeTokens = async (onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.object("0x6"), // Clock
      ],
      target: `${packageId}::blessedbits::unstake_tokens`,
    });

    return executeTransaction(tx, {
      successMessage: "Tokens unstaked successfully!",
      errorMessage: "Error unstaking tokens. Please try again.",
      loadingMessage: "Unstaking tokens...",
      onSuccess,
    });
  };

  /* ====== BADGE FUNCTIONS ====== */
  const awardBadge = async (
    badgeCollectionId,
    badgeType,
    description,
    recipient,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(badgeCollectionId),
        tx.pure.string(badgeType),
        tx.pure.string(description),
        tx.pure.address(recipient),
        tx.object("0x6"), // Clock
      ],
      target: `${packageId}::blessedbits::award_badge`,
    });

    return executeTransaction(tx, {
      successMessage: "Badge awarded successfully!",
      errorMessage: "Error awarding badge. Please try again.",
      loadingMessage: "Awarding badge...",
      onSuccess,
    });
  };

  /* ====== TOKEN PURCHASE ====== */
  const purchaseTokens = async (
    treasuryCapId,
    payment,
    blessAmount,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.object(treasuryCapId),
        tx.object(payment),
        tx.pure.u64(blessAmount),
        tx.object("0x6"), // Clock
      ],
      target: `${packageId}::blessedbits::purchase_tokens`,
    });

    return executeTransaction(tx, {
      successMessage: "Tokens purchased successfully!",
      errorMessage: "Error purchasing tokens. Please try again.",
      loadingMessage: "Purchasing tokens...",
      onSuccess,
    });
  };

  /* ====== STAKING REWARDS ====== */
  const distributeStakerRewards = async (treasuryCapId, onSuccess) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.object(treasuryCapId),
        tx.object("0x6"), // Clock
      ],
      target: `${packageId}::blessedbits::distribute_staker_rewards`,
    });

    return executeTransaction(tx, {
      successMessage: "Staking rewards distributed successfully!",
      errorMessage: "Error distributing rewards. Please try again.",
      loadingMessage: "Distributing staking rewards...",
      onSuccess,
    });
  };

  /* ====== ACHIEVEMENT CHECK ====== */
  const checkAchievements = async (
    badgeCollectionId,
    userAddress,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformStateId),
        tx.object(badgeCollectionId),
        tx.pure.address(userAddress),
        tx.object("0x6"), // Clock
      ],
      target: `${packageId}::blessedbits::check_achievements`,
    });

    return executeTransaction(tx, {
      successMessage: "Achievements checked successfully!",
      errorMessage: "Error checking achievements. Please try again.",
      loadingMessage: "Checking achievements...",
      onSuccess,
    });
  };

  return {
    uploadVideo,
    deleteVideo,
    refreshDailyPool,
    registerUser,
    updateProfile,
    updateUsername,
    updateBio,
    vote,
    sendReward,
    followUser,
    claimDailyCashback,
    stakeTokens,
    unstakeTokens,
    awardBadge,
    purchaseTokens,
    distributeStakerRewards,
    checkAchievements,
  };
};

export default useCreateContent;
