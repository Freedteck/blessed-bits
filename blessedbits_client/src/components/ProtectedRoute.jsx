import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import styles from "./ProtectedRoute.module.css";
import Button from "./shared/button/Button";
import { WalletContext } from "./context/walletContext";

const ProtectedRoutes = () => {
  const account = useCurrentAccount();
  const { isRegistered: isUserRegistered } = useContext(WalletContext);
  const navigate = useNavigate();

  if (!isUserRegistered) {
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
  } else if (!account) {
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

  return <Outlet />;
};

export default ProtectedRoutes;
