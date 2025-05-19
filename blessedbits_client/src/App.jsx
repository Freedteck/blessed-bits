import Sidebar from "./components/shared/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import styles from "./App.module.css";
import ScrollToTop from "./utils/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { getBlessBalance } from "./utils/balance";
import { useNetworkVariable } from "./config/networkConfig";
import { WalletContext } from "./components/context/walletContext";
import { useQueryEvents } from "./hooks/useQueryEvents";

function App() {
  const [balance, setBalance] = useState(0);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const packageId = useNetworkVariable("packageId");

  const { data: registeredUserEvents } = useQueryEvents({
    packageId,
    eventType: "UserRegistered",
    filters: {
      userAddress: account?.address,
    },
  });

  const isUserRegistered = registeredUserEvents?.length > 0;

  useEffect(() => {
    const fetchBlessBalance = async () => {
      if (account?.address) {
        const balance = await getBlessBalance(
          suiClient,
          account.address,
          packageId
        );
        setBalance(balance.toString());
      }
    };

    fetchBlessBalance();
  }, [account, packageId, suiClient]);
  return (
    <WalletContext.Provider
      value={{ blessBalance: balance, isRegistered: isUserRegistered }}
    >
      <div
        className={
          isUserRegistered && account
            ? styles.containerWithSidebar
            : styles.containerFullWidth
        }
      >
        <ScrollToTop />
        <Toaster position="top-center" />
        {isUserRegistered && account && <Sidebar />}
        <Outlet />
      </div>
    </WalletContext.Provider>
  );
}

export default App;
