export default function normalizeConstantCase(string: string) {
  return string.toLowerCase().replaceAll("_", " ");
}
