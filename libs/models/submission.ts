import BaseModel from "./base-model";
import GameTeam from "./game-team";
import Mission from "./mission";

export default interface Submission extends BaseModel {
  id: string;
  is_accepted: boolean;
  answer_data: SubmissionAnswerData;
  caption: string;
  game_team_id: string;
  game_team?: GameTeam;
  mission_id: string;
  mission?: Mission;
}

interface SubmissionAnswerData {
  // image
  urls?: string[];

  // text
  answer?: string;

  // gps
  latitude?: number;
  longitude?: number;
}
