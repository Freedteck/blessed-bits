import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const usePlatformStats = (
  platformStateId,
  platformConfigId,
  userAddress = null
) => {
  const [stats, setStats] = useState(null);
  const [userStaking, setUserStaking] = useState(null);

  const {
    data: platformState,
    refetch: refetchState,
    isPendingPlatformState,
  } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: { showContent: true },
    },
    { enabled: !!platformStateId }
  );

  const {
    data: platformConfig,
    refetch: refetchConfig,
    isPending: isPendingConfig,
  } = useSuiClientQuery(
    "getObject",
    {
      id: platformConfigId,
      options: { showContent: true },
    },
    { enabled: !!platformConfigId }
  );
  const isPending = isPendingPlatformState || isPendingConfig;
  const refetch = () => {
    refetchState();
    refetchConfig();
  };

  useEffect(() => {
    if (
      platformState?.data?.content?.fields &&
      platformConfig?.data?.content?.fields
    ) {
      const fields = platformState.data.content.fields;
      const configFields = platformConfig.data.content.fields;

      // Platform stats
      setStats({
        videoCount: fields.video_count,
        badgeCount: fields.badge_count,
        userCount: fields.user_count,
        dailyRewardsPool: fields.daily_rewards_pool,
        totalStaked: fields.total_staked,
        dailyCashbackAmount: configFields.daily_cashback_amount,
        minPurchaseAmount: configFields.min_purchase_amount,
        blessPerSui: configFields.bless_per_sui,
        dailyRewardsBase: configFields.daily_rewards_base,
        stakingRewardPercent: configFields.staking_reward_percent,
      });

      // User staking info if address provided
      if (userAddress) {
        const userProfile = fields.user_profiles.fields.contents.find(
          (entry) => entry.fields.key === userAddress
        );
        if (userProfile) {
          setUserStaking({
            stakedAmount: userProfile.fields.value.fields.staked_amount,
            votingPower: userProfile.fields.value.fields.voting_power,
            lastCashbackClaim:
              userProfile.fields.value.fields.last_cashback_claim,
          });
        }
      }
    }
  }, [platformState, userAddress, platformConfig]);

  return {
    stats,
    userStaking,
    isPending,
    refetch,
  };
};
