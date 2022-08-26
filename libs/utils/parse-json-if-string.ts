export default function parseJsonIfString<T>(data: T | string): T {
  if (typeof data === "string") return JSON.parse(data);
  return data;
}
