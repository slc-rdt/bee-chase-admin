export default interface SubmissionAnswerData {
  // image
  // urls?: string[];
  download_url?: string;
  last_modified_date_time?: string;
  hash?: string;
  file_name?: string;
  mime_type?: string;
  size?: number;

  // text
  text?: string;

  // gps
  latitude?: number;
  longitude?: number;

  // multiple choice
  answers?: string[];
}
