export enum AvailabilityTypes {
  AVAILABLE,
  HIDDEN,
  EXPIRED,
}

export enum AnswerTypes {
  MULTIPLE_CHOICE = 3,
  TEXT = 1,
  VERIFICATION = 4,
  IMAGE = 0,
  GPS = 2,
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
  PHOTO_ONLY = 1,
  VIDEO_ONLY = 2,
  PHOTO_AND_VIDEO = 0,
}

export enum SubmissionSource {
  LIVE_CAPTURE_ONLY = 1,
  LIVE_CAPTURE_AND_LIBRARY = 0,
}

export enum GameStatus {
  DRAFT,
  SCHEDULED,
  LIVE,
  ENDED,
  UNKNOWN,
}
