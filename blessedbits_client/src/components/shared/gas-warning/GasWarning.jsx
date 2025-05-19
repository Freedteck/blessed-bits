import { useSuiClientQuery } from "@mysten/dapp-kit";
import styles from "./GasWarning.module.css";

const GasWarning = ({ userAddress, minimumBalance = 0.1 }) => {
  const { data: balance } = useSuiClientQuery(
    "getBalance",
    { owner: userAddress },
    { enabled: !!userAddress }
  );

  const hasEnoughGas = balance?.totalBalance
    ? Number(balance.totalBalance) >= minimumBalance * 1e9
    : false;

  if (!userAddress || hasEnoughGas) return null;

  return (
    <div className={styles.warning}>
      <p>You need at least {minimumBalance} SUI for transaction fees.</p>
      <a
        href={`https://faucet.sui.io/?network=devnet&address=${userAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Get Test SUI
      </a>
    </div>
  );
};

export default GasWarning;
