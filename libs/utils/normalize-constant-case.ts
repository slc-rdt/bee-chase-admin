export default function normalizeConstantCase(string: string) {
  return string.toLowerCase().replace(/\_/gi, " ");
}
