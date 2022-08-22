import { DateTime } from "luxon";
import { GameStatus } from "../enums";
import Game from "../models/game";

export default function getGameStatus(game?: Game): GameStatus {
  if (!game) {
    return GameStatus.UNKNOWN;
  }

  if (!game.start_time || !game.end_time) {
    return GameStatus.DRAFT;
  }

  const now = DateTime.utc();
  const start = DateTime.fromISO(game.start_time.toString()).toUTC();
  const end = DateTime.fromISO(game.end_time.toString()).toUTC();

  if (now.diff(start).milliseconds < 0) {
    return GameStatus.SCHEDULED;
  }

  if (now.diff(start).milliseconds >= 0 && now.diff(end).milliseconds <= 0) {
    return GameStatus.LIVE;
  }

  if (now.diff(end).milliseconds > 0) {
    return GameStatus.ENDED;
  }

  return GameStatus.UNKNOWN;
}
