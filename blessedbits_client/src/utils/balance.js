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

export const formatSuiBalance = (mistBalance) => {
  const balance = Number(mistBalance || 0) / 1_000_000_000;
  return balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' SUI';
};