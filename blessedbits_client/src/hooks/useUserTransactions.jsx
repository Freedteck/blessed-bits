import { useSuiClientQuery } from "@mysten/dapp-kit";
import {
  FaCoins,
  FaExchangeAlt,
  FaLock,
  FaLockOpen,
  FaPercentage,
  FaThumbsUp,
} from "react-icons/fa";
import { useNetworkVariable } from "../config/networkConfig";

export const useUserTransactions = (userAddress) => {
  const packageId = useNetworkVariable("packageId");
  const { data, isLoading, error, refetch } = useSuiClientQuery(
    "queryEvents",
    {
      query: {
        MoveModule: { package: packageId, module: "blessedbits" },
      },
      limit: 50,
      order: "descending",
    },
    {
      enabled: !!userAddress,
    }
  );

  const filteredTransactions = data?.data
    ?.filter((event) => {
      // Filter events relevant to the current user
      const eventData = event.parsedJson;
      return (
        eventData.user === userAddress ||
        eventData.user_address === userAddress ||
        eventData.voter === userAddress ||
        eventData.claimer === userAddress ||
        eventData.sender === userAddress ||
        eventData.recipient === userAddress
      );
    })
    .map((event) => {
      const eventData = event.parsedJson;
      const timestamp = eventData.timestamp || event.timestampMs;
      const date = timestamp ? new Date(Number(timestamp)) : new Date();

      // Map different event types to transaction types
      if (event.type.includes("TipSent")) {
        return {
          id: event.id.txDigest,
          type: eventData.sender === userAddress ? "send" : "receive",
          icon: <FaExchangeAlt />,
          title:
            eventData.sender === userAddress
              ? `Tip to ${eventData.recipient.slice(0, 6)}...`
              : `Tip from ${eventData.sender.slice(0, 6)}...`,
          amount: eventData.amount,
          date: date.toLocaleDateString(),
          timestamp: date.getTime(),
        };
      } else if (event.type.includes("TokensStaked")) {
        return {
          id: event.id.txDigest,
          type: "stake",
          icon: <FaLock />,
          title: "Tokens Staked",
          amount: eventData.amount,
          date: date.toLocaleDateString(),
          timestamp: date.getTime(),
        };
      } else if (event.type.includes("TokensClaimed")) {
        return {
          id: event.id.txDigest,
          type: "unstake",
          icon: <FaLockOpen />,
          title: "Tokens Unstaked",
          amount: eventData.amount,
          date: date.toLocaleDateString(),
          timestamp: date.getTime(),
        };
      } else if (event.type.includes("VoteCast") && eventData.is_like) {
        return {
          id: event.id.txDigest,
          type: "earn",
          icon: <FaThumbsUp />,
          title: "Video Like Reward",
          amount: eventData.reward_distributed,
          date: date.toLocaleDateString(),
          timestamp: date.getTime(),
        };
      } else if (event.type.includes("CashbackClaimed")) {
        return {
          id: event.id.txDigest,
          type: "earn",
          icon: <FaCoins />,
          title: "Daily Cashback",
          amount: eventData.amount,
          date: date.toLocaleDateString(),
          timestamp: date.getTime(),
        };
      } else if (event.type.includes("StakerRewardClaimed")) {
        return {
          id: event.id.txDigest,
          type: "earn",
          icon: <FaPercentage />,
          title: "Staking Reward",
          amount: eventData.amount,
          date: date.toLocaleDateString(),
          timestamp: date.getTime(),
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);

  return {
    transactions: filteredTransactions || [],
    isLoading,
    error,
    refetch,
  };
};
