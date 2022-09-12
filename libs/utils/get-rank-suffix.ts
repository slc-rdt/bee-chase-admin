const rankSuffixMapping = new Map([
  [1, "st"],
  [2, "nd"],
  [3, "rd"],
]);

export default function getRankSuffix(rank : number) {
    const lastDigit = rank % 10;
    return rankSuffixMapping.get(lastDigit) ?? "th";
}