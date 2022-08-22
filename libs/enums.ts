export const LuxonFormatForInputDateTimeLocal = "yyyy-LL-dd'T'HH:mm";

export enum AvailabilityTypes {
  AVAILABLE,
  HIDDEN,
  EXPIRED,
}

export enum AnswerTypes {
  IMAGE,
  TEXT,
  GPS,
}

export enum AutomationType {
  SET_MISSION_AVAILABLE,
  SET_MISSION_EXPIRED,
  NOTIFY_ALL_USERS,
}

export enum MediaType {
  PHOTO_AND_VIDEO,
  PHOTO_ONLY,
  VIDEO_ONLY,
}

export enum SubmissionSource {
  LIVE_CAPTURE_AND_LIBRARY,
  LIVE_CAPTURE_ONLY,
}

export enum GameStatus {
  DRAFT,
  SCHEDULED,
  LIVE,
  ENDED,
  UNKNOWN,
}
