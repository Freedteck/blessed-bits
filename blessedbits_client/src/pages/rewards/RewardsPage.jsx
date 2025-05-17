import { useState } from "react";
import { FaCoins, FaLock, FaLockOpen, FaWallet } from "react-icons/fa";
import styles from "./RewardsPage.module.css";
import Leaderboard from "../../components/rewards/leaderboard/Leaderboard";
import Transactions from "../../components/rewards/transactions/Transactions";
import StakeModal from "../../components/rewards/stake-modal/StakeModal";

const RewardsPage = () => {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [action, setAction] = useState("stake"); // 'stake' or 'unstake'

  // Sample data
  const walletInfo = {
    total: 4820,
    staked: 1500,
    votingPower: 150, // 1 VP per 10 BLESS staked
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
      type: "stake",
      icon: <FaLock />,
      title: "Tokens Staked",
      amount: 500,
      date: "2 hours ago",
    },
    {
      id: 2,
      type: "earn",
      icon: <FaCoins />,
      title: "Video Likes",
      amount: 24,
      date: "5 hours ago",
    },
    {
      id: 3,
      type: "unstake",
      icon: <FaLockOpen />,
      title: "Tokens Unstaked",
      amount: 200,
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
  ];

  const handleStakeAction = (type) => {
    setAction(type);
    setShowStakeModal(true);
  };

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h2>Your Rewards</h2>
        <div className={styles.actionButtons}>
          <button
            className={styles.stakeButton}
            onClick={() => handleStakeAction("stake")}
          >
            <FaLock /> Stake
          </button>
          <button
            className={styles.unstakeButton}
            onClick={() => handleStakeAction("unstake")}
          >
            <FaLockOpen /> Unstake
          </button>
        </div>
      </header>

      {/* Balance Card - Keeping the original beautiful style */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceHeader}>
          <span>Total Balance</span>
          <FaWallet className={styles.walletIcon} />
        </div>
        <div className={styles.balanceAmount}>
          {walletInfo.total.toLocaleString()} $BLESS
        </div>

        <div className={styles.balanceDetails}>
          <div className={styles.detailItem}>
            <FaLock className={styles.detailIcon} />
            <span>Staked: {walletInfo.staked.toLocaleString()} $BLESS</span>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.votingPowerBadge}>
              {walletInfo.votingPower} VP
            </div>
            <span>Voting Power</span>
          </div>
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

      {/* Stake/Unstake Modal */}
      {showStakeModal && (
        <StakeModal
          action={action}
          balance={action === "stake" ? walletInfo.total : walletInfo.staked}
          onClose={() => setShowStakeModal(false)}
          onSubmit={(amount) => {
            console.log(
              `${action === "stake" ? "Staking" : "Unstaking"} ${amount} $BLESS`
            );
            setShowStakeModal(false);
          }}
        />
      )}
    </main>
  );
};

export default RewardsPage;
