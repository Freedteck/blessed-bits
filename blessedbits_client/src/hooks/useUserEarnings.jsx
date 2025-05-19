import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";

export const useUserEarnings = (userAddress, packageId) => {
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isPending, setIsPending] = useState(true);

  // This would actually query your contract's events
  const { data: eventsData, refetch } = useSuiClientQuery(
    "queryEvents",
    {
      query: {
        sender: userAddress,
        // Adjust this to match your event types
        MoveEventType: `${packageId}::blessedbits::*`,
      },
      //   limit: 20,
    },
    { enabled: !!userAddress }
  );

  useEffect(() => {
    if (!eventsData?.data) return;

    // Process events to create weekly earnings data
    const now = new Date();
    const dailyEarnings = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

    // Process events to create transactions
    const txList = eventsData.data.map((event) => {
      const eventType = event.eventType.split("::").pop();
      const timestamp = new Date(Number(event.timestampMs));
      const dayOfWeek = timestamp.getDay(); // 0=Sun, 6=Sat

      let amount = 0;
      let type = "earn";
      let title = "Reward";
      let icon = <FaCoins />;

      if (eventType === "VoteCast") {
        amount = event.parsedJson.reward_distributed || 0;
        title = "Voting Reward";
      } else if (eventType === "TokensStaked") {
        amount = event.parsedJson.amount || 0;
        type = "stake";
        title = "Tokens Staked";
        icon = <FaLock />;
      } else if (eventType === "TokensClaimed") {
        amount = event.parsedJson.amount || 0;
        type = "unstake";
        title = "Tokens Unstaked";
        icon = <FaLockOpen />;
      } else if (eventType === "TipSent") {
        amount = event.parsedJson.amount || 0;
        title = "Tip Sent";
        icon = <FaCoins />;
      } else if (eventType === "CashbackClaimed") {
        amount = event.parsedJson.amount || 0;
        title = "Cashback Claimed";
        icon = <FaCoins />;
      } else if (eventType === "TokensPurchased") {
        amount = event.parsedJson.bless_amount || 0;
        title = "Tokens Purchased";
        icon = <FaCoins />;
      } else if (eventType === "StakerRewardClaimed") {
        amount = event.parsedJson.amount || 0;
        title = "Staker Reward Claimed";
        icon = <FaCoins />;
      }

      // Add to daily earnings
      if (
        amount > 0 &&
        now.getTime() - timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
      ) {
        dailyEarnings[dayOfWeek] += amount;
      }

      return {
        id: event.id.txDigest,
        type,
        icon,
        title,
        amount,
        date: formatDate(timestamp),
      };
    });

    // Convert to Mon-Sun format for the chart
    const weeklyData = [
      dailyEarnings[1], // Mon
      dailyEarnings[2], // Tue
      dailyEarnings[3], // Wed
      dailyEarnings[4], // Thu
      dailyEarnings[5], // Fri
      dailyEarnings[6], // Sat
      dailyEarnings[0], // Sun
    ];

    setWeeklyEarnings(weeklyData);
    setTransactions(txList);
    setIsPending(false);
  }, [eventsData]);

  return { weeklyEarnings, transactions, isPending, refetch };
};

// Helper function to format date
function formatDate(date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60 * 1000) return "Just now";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} min ago`;
  if (diff < 24 * 60 * 60 * 1000)
    return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
  return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`;
}
