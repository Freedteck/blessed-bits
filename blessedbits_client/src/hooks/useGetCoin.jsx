import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export const useGetCoin = (packageId) => {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const getBlessedCoin = async () => {
    if (!account?.address) return null;

    // 1. Fetch all BLESS coins
    const { data: coins } = await suiClient.getCoins({
      owner: account.address,
      coinType: `${packageId}::blessedbits::BLESSEDBITS`,
    });

    // 2. Return null if no coins exist
    if (!coins || coins.length === 0) return null;

    // 3. If single coin, return it immediately (fast path)
    if (coins.length === 1) return coins[0].coinObjectId;

    // 4. Multiple coins detected - perform merge
    console.log(`Merging ${coins.length} BLESS coins...`);

    const tx = new Transaction();
    const [primaryCoin, ...coinsToMerge] = coins;

    // Merge all secondary coins into primary
    tx.mergeCoins(
      tx.object(primaryCoin.coinObjectId),
      coinsToMerge.map((coin) => tx.object(coin.coinObjectId))
    );

    // 5. WAIT for merge to complete before returning
    await signAndExecute({ transaction: tx });
    console.log("Coin merge completed");

    // 6. Verify merge by fetching coins again
    const { data: updatedCoins } = await suiClient.getCoins({
      owner: account.address,
      coinType: `${packageId}::blessedbits::BLESSEDBITS`,
    });

    // Return the (now merged) primary coin
    return updatedCoins?.[0]?.coinObjectId ?? null;
  };

  return { getBlessedCoin };
};
