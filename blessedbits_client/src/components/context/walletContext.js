import { createContext } from "react";

export const WalletContext = createContext({
  blessBalance: 0,
  isRegistered: false,
});
