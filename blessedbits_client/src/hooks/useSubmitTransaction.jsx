import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import styles from "./TransactionToast.module.css";

const useSubmitTransaction = (suiClient, signAndExecute) => {
  const executeTransaction = async (
    tx,
    {
      onSuccess = () => {},
      onError = () => {},
      successMessage = "Transaction successful!",
      errorMessage = "Transaction failed. Please try again.",
      loadingMessage = "Processing transaction...",
    }
  ) => {
    let toastId;
    let cancelled = false;

    // Create custom toast with cancel icon
    toastId = toast.custom(
      (t) => (
        <div className={styles.toastContainer}>
          <div className={styles.toastContent}>
            <div className={styles.spinner}></div>
            <span className={styles.message}>{loadingMessage}</span>
          </div>
          <button
            className={styles.cancelButton}
            onClick={() => {
              cancelled = true;
              toast.dismiss(t.id);
              toast.error("Transaction cancelled");
              onError(new Error("User cancelled transaction"));
            }}
            aria-label="Cancel transaction"
          >
            <FaTimes className={styles.cancelIcon} />
          </button>
        </div>
      ),
      {
        duration: Infinity,
      }
    );

    try {
      if (cancelled) return;

      const result = await signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            if (cancelled) return;

            try {
              const txResult = await suiClient.waitForTransaction({
                digest: digest,
                options: { showEffects: true },
              });

              toast.dismiss(toastId);
              toast.success(successMessage, {
                className: styles.successToast,
                duration: 5000,
              });

              onSuccess(txResult);
            } catch (error) {
              toast.dismiss(toastId);
              toast.error(
                "Error verifying transaction. Please check your network.",
                { className: styles.errorToast }
              );
              console.error("Transaction verification error:", error);
              onError(error);
            }
          },
          onError: (error) => {
            if (cancelled) return;

            toast.dismiss(toastId);
            toast.error(errorMessage, { className: styles.errorToast });
            console.error("Transaction error:", error);
            onError(error);
          },
        }
      );

      return result;
    } catch (error) {
      if (!cancelled) {
        toast.dismiss(toastId);
        toast.error(error.message || errorMessage, {
          className: styles.errorToast,
        });
        onError(error);
      }
    }
  };

  return { executeTransaction };
};

export default useSubmitTransaction;
