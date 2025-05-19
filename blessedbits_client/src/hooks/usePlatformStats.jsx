import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export const usePlatformStats = (platformStateId, userAddress = null) => {
  const [stats, setStats] = useState(null);
  const [userStaking, setUserStaking] = useState(null);

  const {
    data: platformState,
    refetch,
    isPending,
  } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: { showContent: true },
    },
    { enabled: !!platformStateId }
  );

  useEffect(() => {
    if (platformState?.data?.content?.fields) {
      const fields = platformState.data.content.fields;

      // Platform stats
      setStats({
        videoCount: fields.video_count,
        badgeCount: fields.badge_count,
        userCount: fields.user_count,
        dailyRewardsPool: fields.daily_rewards_pool,
        totalStaked: fields.total_staked,
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
  }, [platformState, userAddress]);

  return {
    stats,
    userStaking,
    isPending,
    refetch,
  };
};
