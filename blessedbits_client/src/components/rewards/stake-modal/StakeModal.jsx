import { useEffect, useState } from "react";
import { FaTimes, FaLock, FaLockOpen } from "react-icons/fa";
import styles from "./StakeModal.module.css";
import Button from "../../shared/button/Button";

const StakeModal = ({ action, balance, onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const actionLabel = action === "stake" ? "Stake" : "Unstake";
  const actionIcon = action === "stake" ? <FaLock /> : <FaLockOpen />;

  useEffect(() => {
    if (action === "unstake") {
      setAmount(balance);
    }
  }, [action, balance]);

  const handleSubmit = () => {
    if (!amount || isNaN(amount)) return;
    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || numAmount > balance) return;
    onSubmit(numAmount);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>
            {actionIcon} {actionLabel} Tokens
          </h3>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.balanceInfo}>
            <span>Available to {action}:</span>
            <span className={styles.balanceAmount}>
              {balance.toLocaleString()} $BLESS
            </span>
          </div>

          <div className={styles.formGroup}>
            <label>Amount to {actionLabel}</label>
            <div className={styles.amountInput}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={action === "unstake"}
              />
              <span>$BLESS</span>
            </div>
            {action === "unstake" && (
              <p className={styles.infoMessage}>
                You can only unstake your entire balance.
              </p>
            )}
            {amount && (amount > balance || amount <= 0) && (
              <p className={styles.errorMessage}>
                {amount <= 0
                  ? "Amount must be positive"
                  : "Insufficient balance"}
              </p>
            )}
          </div>

          {action === "stake" && (
            <div className={styles.votingPowerInfo}>
              <span>Voting Power Gain:</span>
              <span className={styles.votingPowerAmount}>
                {amount ? Math.floor(amount / 10) : 0} VP
              </span>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              !amount || isNaN(amount) || amount <= 0 || amount > balance
            }
          >
            {actionLabel} Tokens
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StakeModal;
