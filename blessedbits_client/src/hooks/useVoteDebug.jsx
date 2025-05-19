import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";

export const useGetCoin = (packageId) => {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const getBlessedCoin = async () => {
    if (account?.address) {
      const coins = await suiClient.getCoins({
        owner: account.address,
        coinType: `${packageId}::blessedbits::BLESSEDBITS`,
      });
      return coins.data[0]?.coinObjectId; // Return the first coin object ID
    }
  };

  return { getBlessedCoin };
};
