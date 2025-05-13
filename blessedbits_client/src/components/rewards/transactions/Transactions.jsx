import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import styles from "./Transactions.module.css";

const Transactions = ({ data }) => {
  return (
    <div className={styles.transactions}>
      {data.map((tx) => (
        <div key={tx.id} className={styles.transaction}>
          <div className={`${styles.transactionIcon} ${styles[tx.type]}`}>
            {tx.icon}
          </div>
          <div className={styles.transactionDetails}>
            <span className={styles.transactionTitle}>{tx.title}</span>
            <span className={styles.transactionDate}>{tx.date}</span>
          </div>
          <div className={`${styles.transactionAmount} ${styles[tx.type]}`}>
            {tx.type === "earn" ? (
              <FaArrowUp className={styles.arrowIcon} />
            ) : (
              <FaArrowDown className={styles.arrowIcon} />
            )}
            {tx.amount} $BLESS
          </div>
        </div>
      ))}
    </div>
  );
};

export default Transactions;
