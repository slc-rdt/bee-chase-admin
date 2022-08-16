import BaseModel from "./base-model";

export default interface Game extends BaseModel {
  access_code: string;
  name: string;
  description: string;
  password: string;
  start_time: Date | string | null; // ISO date string
  end_time: Date | string | null; // ISO date string
  max_player_per_team: number;
  allow_user_create_team: boolean;
}
