import BaseModel from "./base-model";
import GameTeamUser from "./game-team-user";
import Submission from "./submission";

export default interface GameTeam extends BaseModel {
  game_id: string;
  name: string;
  color?: string;
  access_code?: string;
  submissions?: Submission[];
  submissions_count?: number;
  missions_sum_point_value?: number;
  rank?: number;
  members?: GameTeamUser[];
}
