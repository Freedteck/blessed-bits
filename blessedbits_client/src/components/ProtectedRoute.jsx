import {
  ConnectButton,
  useCurrentAccount,
  useCurrentWallet,
} from "@mysten/dapp-kit";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import styles from "./ProtectedRoute.module.css";
import Button from "./shared/button/Button";
import { WalletContext } from "./context/walletContext";
import Loading from "./shared/loading/Loading";

const ProtectedRoutes = () => {
  const account = useCurrentAccount();
  const { isRegistered: isUserRegistered, checkingRegistration } =
    useContext(WalletContext);
  const { isConnecting } = useCurrentWallet();

  const navigate = useNavigate();

  if (isConnecting && !account) {
    return (
      <div className={styles.container}>
        {/* <div className={styles.card}>
          <h1 className={styles.title}>Connecting...</h1>
          <p className={styles.message}>
            Please wait while we connect to your wallet.
          </p>
        </div> */}
        <Loading />
      </div>
    );
  }
  if (!account) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Wallet Not Connected</h1>
          <p className={styles.message}>
            Please connect your wallet to access the app.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }
  if (!checkingRegistration && !isUserRegistered) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Registration Required</h1>
          <p className={styles.message}>
            Welcome to BlessedBits! To access all features, please complete your
            registration first.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => navigate("/app/register")}>
              Complete Registration
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className={styles.secondaryButton}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{account && isUserRegistered && <Outlet />}</>;
};

export default ProtectedRoutes;
