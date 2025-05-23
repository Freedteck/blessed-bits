import { useState, useEffect } from "react";
import {
  FaTimes,
  FaShoppingCart,
  FaInfoCircle,
  FaExchangeAlt,
} from "react-icons/fa";
import styles from "./BuyModal.module.css";
import Button from "../../shared/button/Button";

const BuyModal = ({ balance, onClose, onSubmit }) => {
  const [blessAmount, setBlessAmount] = useState("");
  const [suiCost, setSuiCost] = useState(0);
  const [minBless, _setMinBless] = useState(100); // Minimum 100 BLESS
  const [exchangeRate, _setExchangeRate] = useState(10000); // 1 SUI = 10,000 BLESS

  // Calculate SUI cost when BLESS input changes
  useEffect(() => {
    if (blessAmount && !isNaN(blessAmount)) {
      const amount = parseFloat(blessAmount);
      if (amount > 0) {
        // Calculate SUI cost (rounding up to ensure enough SUI)
        const calculatedSui = Math.ceil((amount / exchangeRate) * 100) / 100;
        setSuiCost(calculatedSui);
      } else {
        setSuiCost(0);
      }
    } else {
      setSuiCost(0);
    }
  }, [blessAmount, exchangeRate]);

  const handleSubmit = () => {
    const amount = parseFloat(blessAmount);
    if (!amount || isNaN(amount) || amount < minBless) return;

    // Submit both BLESS amount and calculated SUI cost
    onSubmit(amount, suiCost);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>
            <FaShoppingCart /> Buy $BLESS Tokens
          </h3>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.balanceInfo}>
            <span>Your Balance:</span>
            <span className={styles.balanceAmount}>
              {balance.toLocaleString()} $BLESS
            </span>
          </div>

          <div className={styles.formGroup}>
            <label>Amount ($BLESS)</label>
            <div className={styles.amountInput}>
              <input
                type="number"
                value={blessAmount}
                onChange={(e) => setBlessAmount(e.target.value)}
                placeholder="0"
                min={minBless}
                step="100" // Increment by 100 BLESS
              />
              <span>$BLESS</span>
            </div>
            {blessAmount && parseFloat(blessAmount) < minBless && (
              <p className={styles.errorMessage}>
                Minimum purchase is {minBless} $BLESS
              </p>
            )}
          </div>

          <div className={styles.conversionInfo}>
            <div className={styles.conversionRate}>
              <FaExchangeAlt />
              <span>1 SUI = {exchangeRate.toLocaleString()} $BLESS</span>
            </div>
            <div className={styles.costSummary}>
              <span>Estimated Cost:</span>
              <span className={styles.costAmount}>
                {suiCost.toFixed(2)} SUI
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              !blessAmount ||
              isNaN(blessAmount) ||
              parseFloat(blessAmount) < minBless
            }
          >
            Buy Tokens
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
