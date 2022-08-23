import { DateTime } from "luxon";

export default function convertTimeLocalToServer(
  date: Date | string,
) {
  const dateTime = DateTime.fromISO(date.toString() ?? "").toUTC();
  return dateTime.toISO();
}
