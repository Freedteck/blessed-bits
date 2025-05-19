import { useMemo } from "react";
import { useUserTransactions } from "./useUserTransactions";

export const useWeeklyEarnings = (userAddress) => {
  const { transactions } = useUserTransactions(userAddress);

  const weeklyEarnings = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Initialize an array with 7 days (0 for each day)
    const earningsByDay = Array(7).fill(0);

    // Get all earning transactions from the last week
    const recentEarnings = transactions.filter(
      (tx) =>
        tx.type === "earn" ||
        (tx.type === "receive" && new Date(tx.timestamp) > oneWeekAgo)
    );

    // Group earnings by day of the week (0 = Sunday, 1 = Monday, etc.)
    recentEarnings.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      earningsByDay[dayOfWeek] += tx.amount;
    });

    // Normalize values for the chart (0-100 scale)
    const maxEarning = Math.max(...earningsByDay, 1); // Avoid division by zero
    return earningsByDay.map((amount) =>
      Math.round((amount / maxEarning) * 100)
    );
  }, [transactions]);

  return weeklyEarnings;
};
