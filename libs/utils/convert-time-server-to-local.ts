import { DateTime } from "luxon";
import { LuxonFormatForInputDateTimeLocal } from "../constants";

export default function convertTimeServerToLocal(date: Date | string) {
  return DateTime.fromISO(date.toString() ?? "")
    .toUTC()
    .toLocal()
    .toFormat(LuxonFormatForInputDateTimeLocal);
}
