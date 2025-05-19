export const formatCoin = (
  amount,
  options = {
    precision: 2, // Changed default to 2 for more precision
    decimalSeparator: ".",
    suffixLowercase: false,
    spaceBeforeSuffix: false,
    trimTrailingZeros: true, // Added new option
    minPrecision: 0, // Added new option for minimum decimal places
  }
) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";

  const {
    precision = 2,
    decimalSeparator = ".",
    suffixLowercase = false,
    spaceBeforeSuffix = false,
    trimTrailingZeros = true,
    minPrecision = 0,
  } = options;

  const absNum = Math.abs(num);
  const tier = (Math.log10(absNum) / 3) | 0;

  if (tier === 0) {
    // Handle numbers below 1000 with proper decimal formatting
    if (num % 1 === 0) return num.toString(); // Integer
    return num.toFixed(minPrecision).replace(/\.?0+$/, "");
  }

  const suffixes = suffixLowercase ? ["", "k", "m", "b"] : ["", "K", "M", "B"];
  const suffix = (spaceBeforeSuffix ? " " : "") + suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  // Calculate the actual needed precision
  const neededPrecision = Math.max(
    minPrecision,
    Math.min(
      precision,
      // Calculate how many decimal places are meaningful
      Math.max(0, precision - Math.floor(Math.log10(scaled)))
    )
  );

  // Format with dynamic precision
  let formatted = scaled.toFixed(neededPrecision);

  if (trimTrailingZeros) {
    formatted = formatted.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.$/, "");
  }

  return formatted.replace(".", decimalSeparator) + suffix;
};
