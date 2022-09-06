export default function parseStringIfJson(data: object): string {
  return typeof data === "string" ? data : JSON.stringify(data);
}
