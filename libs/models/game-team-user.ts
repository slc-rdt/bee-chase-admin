import { User } from "next-auth";
import BaseModel from "./base-model";

export default interface GameTeamUser extends BaseModel {
  game_team_id: string;
  user_id: string;

  user?: User;
}
