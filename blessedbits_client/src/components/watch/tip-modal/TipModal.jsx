import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./TipModal.module.css";
import Button from "../../shared/button/Button";

const TipModal = ({ creatorName, onClose, onTipSubmit }) => {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleTipSubmit = () => {
    const amount = selectedAmount || customAmount;
    if (!amount) return;

    onTipSubmit(amount);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Tip Creator</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>Send $BLESS tokens to show your appreciation to {creatorName}</p>
          <div className={styles.tipAmounts}>
            {[5, 10, 25, 50].map((amount) => (
              <button
                key={amount}
                className={`${styles.tipAmount} ${
                  selectedAmount === amount ? styles.selected : ""
                }`}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
              >
                {amount} $BLESS
              </button>
            ))}
          </div>
          <div className={styles.customTip}>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
            />
            <span>$BLESS</span>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <Button
            variant="primary"
            onClick={handleTipSubmit}
            disabled={!selectedAmount && !customAmount}
          >
            Confirm Tip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TipModal;
