import { useSuiClientQuery } from "@mysten/dapp-kit";

export const useUserBlessBalance = (
  userAddress,
  packageId,
  platformStateId
) => {
  // 1. Get regular $BLESS coin balance
  const {
    data: balanceData,
    isPending: isBalancePending,
    refetch: refetchBalance,
  } = useSuiClientQuery(
    "getBalance",
    {
      owner: userAddress,
      coinType: `${packageId}::blessedbits::BLESSEDBITS`,
    },
    { enabled: !!userAddress }
  );

  // 2. Get staking info from platform state
  const {
    data: platformState,
    isPending: isPlatformPending,
    refetch: refetchPlatform,
  } = useSuiClientQuery(
    "getObject",
    {
      id: platformStateId,
      options: { showContent: true },
    },
    { enabled: !!platformStateId && !!userAddress }
  );

  // Calculate derived values
  const walletBless = +balanceData?.totalBalance || 0;
  let stakedBless = 0;
  let votingPower = 0;

  if (platformState?.data?.content?.fields?.user_profiles?.fields?.contents) {
    const userProfile =
      platformState.data.content.fields.user_profiles.fields.contents.find(
        (entry) => entry.fields.key === userAddress
      );

    if (userProfile) {
      stakedBless = Number(userProfile.fields.value.fields.staked_amount);
      votingPower = userProfile.fields.value.fields.voting_power;
    }
  }

  const totalBless = walletBless + stakedBless;

  return {
    // Balance info
    totalBless,
    walletBless,
    stakedBless,

    // Voting power
    votingPower,

    // Loading state
    isPending: isBalancePending || isPlatformPending,

    // Refresh
    refetch: () => {
      refetchBalance();
      refetchPlatform();
    },

    // Derived calculations
    stakedPercentage: totalBless > 0 ? (stakedBless / totalBless) * 100 : 0,
  };
};
