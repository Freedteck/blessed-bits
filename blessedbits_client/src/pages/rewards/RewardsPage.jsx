import { useState } from "react";
import { FaLock, FaLockOpen, FaWallet } from "react-icons/fa";
import styles from "./RewardsPage.module.css";
import Transactions from "../../components/rewards/transactions/Transactions";
import StakeModal from "../../components/rewards/stake-modal/StakeModal";
import { useUserBlessBalance } from "../../hooks/useUserBlessBalance";
import { useNetworkVariables } from "../../config/networkConfig";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useWeeklyEarnings } from "../../hooks/useWeeklyEarnings";
import { useUserTransactions } from "../../hooks/useUserTransactions";
import useCreateContent from "../../hooks/useCreateContent";

const RewardsPage = () => {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [action, setAction] = useState("stake");
  const account = useCurrentAccount();

  const { packageId, platformStateId } = useNetworkVariables(
    "packageId",
    "platformStateId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { stakeTokens, unstakeTokens } = useCreateContent(
    packageId,
    platformStateId,
    suiClient,
    signAndExecute
  );

  const {
    isPending,
    stakedBless,
    totalBless,
    walletBless,
    votingPower,
    refetch,
  } = useUserBlessBalance(account?.address, packageId, platformStateId);

  const weeklyEarnings = useWeeklyEarnings(account?.address);
  const {
    transactions,
    isLoading: transactionsLoading,
    refetch: refetchTxn,
  } = useUserTransactions(account?.address);

  const handleStakeAction = (type) => {
    setAction(type);
    setShowStakeModal(true);
  };

  const handleStakeSubmit = (amount) => {
    if (action === "stake") {
      stakeTokens(amount, () => {
        setShowStakeModal(false);
        refetch();
        refetchTxn();
      });
    } else {
      unstakeTokens(() => {
        setShowStakeModal(false);
        refetch();
        refetchTxn();
      });
    }
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

      {/* Balance Card */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceHeader}>
          <span>Total Balance</span>
          <FaWallet className={styles.walletIcon} />
        </div>
        <div className={styles.balanceAmount}>
          {isPending ? "Loading..." : `${totalBless} $BLESS`}
        </div>

        <div className={styles.balanceDetails}>
          <div className={styles.detailItem}>
            <FaLock className={styles.detailIcon} />
            <span>
              Staked: {isPending ? "Loading..." : `${stakedBless} $BLESS`}
            </span>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.votingPowerBadge}>
              {isPending ? "..." : `${votingPower} VP`}
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
            {weeklyEarnings.map((amount, index) => {
              // Determine bar color based on amount
              let barColor = "";
              if (amount >= 70) {
                barColor = "var(--high-earning)"; // High earnings
              } else if (amount >= 30) {
                barColor = "var(--medium-earning)"; // Medium earnings
              } else {
                barColor = "var(--low-earning)"; // Low earnings
              }

              return (
                <div key={index} className={styles.chartBarContainer}>
                  <div
                    className={styles.chartBar}
                    style={{
                      height: amount > 0 ? `${amount}%` : "2px",
                      backgroundColor: barColor,
                    }}
                    data-value={`${amount}%`}
                  />
                  <span className={styles.chartDay}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: "var(--high-earning)" }}
            ></span>
            <span>High Earnings</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: "var(--medium-earning)" }}
            ></span>
            <span>Medium Earnings</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: "var(--low-earning)" }}
            ></span>
            <span>Low Earnings</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={styles.card}>
        <h3>Recent Transactions</h3>
        {transactionsLoading ? (
          <div>Loading transactions...</div>
        ) : (
          <Transactions data={transactions.slice(0, 5)} />
        )}
      </div>

      {/* Stake/Unstake Modal */}
      {showStakeModal && (
        <StakeModal
          action={action}
          balance={action === "stake" ? walletBless : stakedBless}
          onClose={() => setShowStakeModal(false)}
          onSubmit={handleStakeSubmit}
        />
      )}
    </main>
  );
};

export default RewardsPage;
