import { MediaType, SubmissionSource } from "../enums";

export default interface MissionData {
  // MissionDataText
  accepted_answers?: string | string[]; // newline separated values

  // MissionDataGPS
  latitude?: number;
  longitude?: number;
  radius?: number;

  // MissionDataMedia
  media_type?: MediaType;
  submission_source?: SubmissionSource;
}
