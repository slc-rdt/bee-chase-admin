import BaseModel from "./base-model";
import GameTeam from "./game-team";
import Mission from "./mission";
import SubmissionAnswerData from "./submission-answer-data";

export default interface Submission extends BaseModel {
  id: string;
  is_accepted: boolean;
  answer_data: SubmissionAnswerData | string;
  caption: string;
  game_team_id: string;
  game_team?: GameTeam;
  mission_id: string;
  mission?: Mission;
}
