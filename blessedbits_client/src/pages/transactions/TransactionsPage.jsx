import { useCurrentAccount } from "@mysten/dapp-kit";
import { FaSyncAlt } from "react-icons/fa";
import { useUserTransactions } from "../../hooks/useUserTransactions";
import Loading from "../../components/shared/loading/Loading";
import Transactions from "../../components/rewards/transactions/Transactions";
import styles from "./TransactionsPage.module.css";
import Button from "../../components/shared/button/Button";

const TransactionsPage = () => {
  const account = useCurrentAccount();
  const {
    transactions,
    isLoading: transactionsLoading,
    refetch: refetchTxn,
  } = useUserTransactions(account?.address);

  return (
    <div className={styles.transactionsPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Transaction History</h1>
          <p className={styles.pageSubtitle}>
            All your $BLESS transactions in one place
          </p>
        </div>
        <Button onClick={() => refetchTxn()} icon={<FaSyncAlt />}>
          {transactionsLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className={styles.transactionsContainer}>
        {transactionsLoading ? (
          <Loading />
        ) : (
          <Transactions data={transactions} />
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
