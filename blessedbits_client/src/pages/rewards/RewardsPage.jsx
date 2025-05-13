import { useState } from "react";
import { FaCoins, FaExchangeAlt, FaWallet } from "react-icons/fa";
import styles from "./RewardsPage.module.css";
import Leaderboard from "../../components/rewards/leaderboard/Leaderboard";
import Transactions from "../../components/rewards/transactions/Transactions";
import ConvertModal from "../../components/rewards/convert-modal/ConvertModal";

const RewardsPage = () => {
  const [showConvertModal, setShowConvertModal] = useState(false);

  // Sample data
  const walletBalance = {
    total: 4820,
    equivalent: 142.5,
  };

  const weeklyEarnings = [30, 60, 45, 80, 65, 90, 50]; // Sample data for chart

  const leaderboardData = [
    { rank: 1, initials: "MG", name: "MindfulGuide", earnings: 8450 },
    { rank: 2, initials: "SL", name: "SpiritualLife", earnings: 7920 },
    { rank: 3, initials: "PW", name: "PrayerWarrior", earnings: 7630 },
    { rank: 4, initials: "FP", name: "FaithPath", earnings: 6890 },
    { rank: 5, initials: "CG", name: "CreationGlory", earnings: 6420 },
  ];

  const transactions = [
    {
      id: 1,
      type: "earn",
      icon: <FaCoins />,
      title: "Video Likes",
      amount: 24,
      date: "2 hours ago",
    },
    {
      id: 2,
      type: "earn",
      icon: <FaCoins />,
      title: "New Follower",
      amount: 10,
      date: "5 hours ago",
    },
    {
      id: 3,
      type: "spend",
      icon: <FaExchangeAlt />,
      title: "Converted to USDC",
      amount: 100,
      date: "1 day ago",
    },
    {
      id: 4,
      type: "earn",
      icon: <FaCoins />,
      title: "Community Bonus",
      amount: 50,
      date: "2 days ago",
    },
    {
      id: 5,
      type: "earn",
      icon: <FaCoins />,
      title: "Video Views",
      amount: 32,
      date: "3 days ago",
    },
  ];

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h2>Your Rewards</h2>
        <button
          className={styles.convertButton}
          onClick={() => setShowConvertModal(true)}
        >
          <FaExchangeAlt /> Convert Tokens
        </button>
      </header>

      {/* Balance Card */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceHeader}>
          <span>Total Balance</span>
          <FaWallet className={styles.walletIcon} />
        </div>
        <div className={styles.balanceAmount}>
          {walletBalance.total.toLocaleString()} $BLESS
        </div>
        <div className={styles.balanceEquivalent}>
          ≈ ${walletBalance.equivalent.toFixed(2)} USD
        </div>
      </div>

      {/* Earnings Chart */}
      <div className={styles.card}>
        <h3>Earnings This Week</h3>
        <div className={styles.chartContainer}>
          <div className={styles.chartBars}>
            {weeklyEarnings.map((amount, index) => (
              <div key={index} className={styles.chartBarContainer}>
                <div
                  className={styles.chartBar}
                  style={{ height: `${amount}%` }}
                />
                <span className={styles.chartDay}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className={styles.card}>
        <h3>Leaderboard</h3>
        <Leaderboard data={leaderboardData} />
      </div>

      {/* Recent Transactions */}
      <div className={styles.card}>
        <h3>Recent Transactions</h3>
        <Transactions data={transactions} />
      </div>
      {/* Convert Modal */}
      {showConvertModal && (
        <ConvertModal
          balance={walletBalance.total}
          onClose={() => setShowConvertModal(false)}
          onConvert={(amount) => {
            console.log(`Converting ${amount} $BLESS`);
            setShowConvertModal(false);
          }}
        />
      )}
    </main>
  );
};

export default RewardsPage;
