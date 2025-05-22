import { useEffect, useState } from "react";
import { FaGift, FaLock, FaLockOpen, FaWallet } from "react-icons/fa";
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
import { useUserData } from "../../hooks/useUserData";

const RewardsPage = () => {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [action, setAction] = useState("stake");
  const account = useCurrentAccount();
  const [lastCashbackClaim, setLastCashbackClaim] = useState(0);
  const [canClaimCashback, setCanClaimCashback] = useState(false);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState("");

  const { packageId, platformStateId, treasuryCapId } = useNetworkVariables(
    "packageId",
    "platformStateId",
    "treasuryCapId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { stakeTokens, unstakeTokens, claimDailyCashback } = useCreateContent(
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
  const { userProfile, refetch: refetchUserData } = useUserData(
    platformStateId,
    account?.address
  );

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

  const formatTimeUntilNextClaim = (timeLeft) => {
    if (timeLeft <= 0) return "Now!";

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    // Only show hours if more than 0
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  useEffect(() => {
    if (account?.address) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      const lastClaim = +userProfile?.last_cashback_claim;

      setLastCashbackClaim(lastClaim);
      setCanClaimCashback(now - lastClaim >= twentyFourHours);
    }
  }, [account, userProfile]);

  useEffect(() => {
    if (!canClaimCashback && lastCashbackClaim > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const nextClaimTime = lastCashbackClaim + 24 * 60 * 60 * 1000;
        const timeLeft = nextClaimTime - now;

        if (timeLeft <= 0) {
          setCanClaimCashback(true);
          clearInterval(interval);
          setTimeUntilNextClaim("Now!");
        } else {
          setTimeUntilNextClaim(formatTimeUntilNextClaim(timeLeft));
        }
      }, 60000); // Update every minute

      // Initial calculation
      const initialTimeLeft =
        lastCashbackClaim + 24 * 60 * 60 * 1000 - Date.now();
      setTimeUntilNextClaim(formatTimeUntilNextClaim(initialTimeLeft));

      return () => clearInterval(interval);
    }
  }, [canClaimCashback, lastCashbackClaim]);

  const calculateProgress = () => {
    if (lastCashbackClaim <= 0) return 0;
    const elapsed = Date.now() - lastCashbackClaim;
    const progress = (elapsed / (24 * 60 * 60 * 1000)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const handleClaimCashback = () => {
    claimDailyCashback(treasuryCapId, () => {
      setLastCashbackClaim(Date.now());
      setCanClaimCashback(false);
      refetch(); // Refresh balance
      refetchTxn(); // Refresh transactions
      refetchUserData(); // Refresh user data
    });
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

        {/* Add Cashback Section Here */}
        <div className={styles.cashbackSection}>
          <button
            className={`${styles.cashbackButton} ${
              !canClaimCashback ? styles.disabled : ""
            }`}
            onClick={handleClaimCashback}
            disabled={!canClaimCashback}
          >
            <FaGift /> Claim Cashback
          </button>

          {!canClaimCashback && (
            <div className={styles.cashbackStatus}>
              {lastCashbackClaim > 0 ? (
                <>
                  <span>Next claim: {timeUntilNextClaim}</span>
                  <div className={styles.cashbackProgress}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </>
              ) : (
                <span>Claim your first cashback!</span>
              )}
            </div>
          )}
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
