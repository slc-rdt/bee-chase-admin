import { DateTime } from "luxon";
import { useEffect, useState } from "react";

/**
 * This hook exists to fix next.js SSR issue:
 * "Hydration failed because the initial UI does not match what was rendered on the server."
 *
 * The cause is server and client date time locale are different.
 */
export default function useFormattedDate(
  isoDate: string | Date | null,
  format: Intl.DateTimeFormatOptions | string
): string {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (!isoDate) return;

    const dateTime =
      typeof isoDate === "string"
        ? DateTime.fromISO(isoDate)
        : DateTime.fromJSDate(isoDate);

    setFormattedDate(
      typeof format === "string"
        ? dateTime.toFormat(format)
        : dateTime.toLocaleString(format)
    );
  }, [setFormattedDate, isoDate, format]);

  return formattedDate;
}
