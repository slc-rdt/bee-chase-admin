export default function parseJsonIfString<T>(data: T | string): T {
  return typeof data === "string" ? JSON.parse(data) : data;
}
