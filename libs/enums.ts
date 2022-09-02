export enum AvailabilityTypes {
  AVAILABLE,
  HIDDEN,
  EXPIRED,
}

export enum AnswerTypes {
  IMAGE,
  TEXT,
  GPS,
  MULTIPLE_CHOICE,
  VERIFICATION,
}

export enum AutomationType {
  SET_MISSION_AVAILABLE,
  SET_MISSION_HIDDEN,
  SET_MISSION_EXPIRED,
  NOTIFY_ALL_USERS,
}

export enum AutomationTimeType {
  EXACT,
  AFTER_GAME_STARTS,
  BEFORE_GAME_ENDS,
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
