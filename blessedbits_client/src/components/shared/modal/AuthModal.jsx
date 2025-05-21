import { useEffect, useState } from "react";
import styles from "./AuthModal.module.css";
import {
  FaGoogle,
  FaFacebookF,
  FaTwitch,
  FaWallet,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import { isEnokiWallet } from "@mysten/enoki";
import Loading from "../loading/Loading";

const AuthModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();

  // Get all wallets
  const allWallets = useWallets();

  // Filter out Enoki wallets (for OAuth)
  const enokiWallets = allWallets.filter(isEnokiWallet);
  // Regular wallets (non-Enoki)
  const regularWallets = allWallets.filter((wallet) => !isEnokiWallet(wallet));

  // Organize Enoki wallets by provider
  const walletsByProvider = enokiWallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map()
  );

  const googleWallet = walletsByProvider.get("google");
  const facebookWallet = walletsByProvider.get("facebook");
  const twitchWallet = walletsByProvider.get("twitch");

  // Close modal when account is connected
  useEffect(() => {
    if (currentAccount) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentAccount, onClose]);

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    setConnectionError(null);

    const walletMap = {
      google: googleWallet,
      facebook: facebookWallet,
      twitch: twitchWallet,
    };

    const wallet = walletMap[provider.toLowerCase()];

    if (!wallet) {
      setIsLoading(false);
      setConnectionError(`${provider} login not available`);
      return;
    }

    connect(
      { wallet },
      {
        onSuccess: () => console.log(`${provider} login initiated`),
        onError: (error) => {
          console.error(`${provider} login error:`, error);
          setIsLoading(false);
          setConnectionError(`${provider} login cancelled or failed`);
        },
      }
    );
  };

  const handleWalletConnect = (wallet) => {
    setIsLoading(true);
    setConnectionError(null);
    connect(
      { wallet },
      {
        onSuccess: () => console.log(`Connected to ${wallet.name}`),
        onError: (error) => {
          console.error("Connection error:", error);
          setIsLoading(false);
          setConnectionError(
            error.message || "Wallet connection cancelled or failed"
          );
        },
      }
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Loading overlay */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <Loading message="Authenticating..." />
          </div>
        )}

        {/* Modal header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Connect to BlessedBits</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Error message */}
        {connectionError && (
          <div className={styles.errorMessage}>
            <FaInfoCircle className={styles.errorIcon} />
            <p>{connectionError}</p>
            <button
              onClick={() => setConnectionError(null)}
              className={styles.dismissButton}
              aria-label="Dismiss error message"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Modal content */}
        <div className={styles.modalContent}>
          <p className={styles.modalSubtitle}>
            Choose your preferred connection method to access BlessedBits
          </p>

          <div className={styles.authButtons}>
            <button
              className={`${styles.authButton} ${styles.googleButton}`}
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
            >
              <FaGoogle className={styles.authButtonIcon} />
              Continue with Google
            </button>

            <button
              className={`${styles.authButton} ${styles.facebookButton}`}
              onClick={() => handleOAuthLogin("facebook")}
              disabled={isLoading}
            >
              <FaFacebookF className={styles.authButtonIcon} />
              Continue with Facebook
            </button>

            <button
              className={`${styles.authButton} ${styles.twitchButton}`}
              onClick={() => handleOAuthLogin("Twitch")}
              disabled={isLoading}
            >
              <FaTwitch className={styles.authButtonIcon} />
              Continue with Twitch
            </button>
          </div>

          <div className={styles.authDivider}>
            <span>or</span>
          </div>

          <div className={styles.walletButtons}>
            {regularWallets.length > 0 ? (
              regularWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  className={`${styles.authButton} ${styles.walletButton}`}
                  onClick={() => handleWalletConnect(wallet)}
                  disabled={isLoading}
                >
                  <FaWallet className={styles.authButtonIcon} />
                  Connect with {wallet.name}
                </button>
              ))
            ) : (
              <div className={styles.noWalletsMessage}>
                No wallets detected. Please install a wallet extension.
              </div>
            )}
          </div>

          <div className={styles.privacyNote}>
            <FaInfoCircle className={styles.infoIcon} />
            <p>
              BlessedBits uses zkLogin for secure authentication. Your identity
              remains private and protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
