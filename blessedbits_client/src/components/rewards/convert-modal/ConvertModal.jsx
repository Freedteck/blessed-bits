import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./ConvertModal.module.css";
import Button from "../../shared/button/Button";

const ConvertModal = ({ balance, onClose, onConvert }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [step, setStep] = useState(1); // 1: amount, 2: confirm

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || amount <= 0 || amount > balance) return;

    if (step === 1) {
      setStep(2);
    } else {
      onConvert(amount);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{step === 1 ? "Convert Tokens" : "Confirm Conversion"}</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {step === 1 ? (
            <>
              <div className={styles.balanceInfo}>
                <span>Available Balance:</span>
                <span className={styles.balanceAmount}>
                  {balance.toLocaleString()} $BLESS
                </span>
              </div>

              <div className={styles.formGroup}>
                <label>Amount to Convert</label>
                <div className={styles.amountInput}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <span>$BLESS</span>
                </div>
                {amount && (amount > balance || amount <= 0) && (
                  <p className={styles.errorMessage}>
                    {amount <= 0
                      ? "Amount must be positive"
                      : "Insufficient balance"}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Convert To</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={styles.currencySelect}
                >
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                  <option value="DAI">DAI</option>
                </select>
              </div>

              <div className={styles.conversionRate}>
                <span>Estimated Rate:</span>
                <span>1 $BLESS ≈ $0.0295 {currency}</span>
              </div>
            </>
          ) : (
            <div className={styles.confirmation}>
              <div className={styles.confirmationRow}>
                <span>You're converting:</span>
                <span className={styles.confirmationAmount}>
                  {amount} $BLESS
                </span>
              </div>
              <div className={styles.confirmationRow}>
                <span>To:</span>
                <span className={styles.confirmationAmount}>
                  {(amount * 0.0295).toFixed(2)} {currency}
                </span>
              </div>
              <div className={styles.confirmationRow}>
                <span>Network Fee:</span>
                <span className={styles.confirmationFee}>0.5 $BLESS</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.confirmationRow}>
                <span>You'll receive:</span>
                <span className={styles.confirmationTotal}>
                  {((amount - 0.5) * 0.0295).toFixed(2)} {currency}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {step === 2 && (
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className={styles.backButton}
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              step === 1 &&
              (!amount || isNaN(amount) || amount <= 0 || amount > balance)
            }
          >
            {step === 1 ? "Continue" : "Confirm Conversion"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConvertModal;
