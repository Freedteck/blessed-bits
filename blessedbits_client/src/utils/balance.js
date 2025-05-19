export const getBlessBalance = async (suiClient, userAddress, packageId) => {
  const coinType = `${packageId}::blessedbits::BLESSEDBITS`;

  const coins = await suiClient.getCoins({
    owner: userAddress,
    coinType,
  });

  const total = coins.data.reduce(
    (sum, coin) => sum + BigInt(coin.balance),
    0n
  );

  return total;
};
