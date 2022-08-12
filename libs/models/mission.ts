import BaseModel from "./base-model";
import GameMission from "./game-mission";

export default interface Mission extends BaseModel {
  name: string;
  point_value: number;
  description: string;
  attached_image_link: string;
  attached_link: string;
  shown_in_feed: boolean;
  answer_type: number;
  mission_data: string;
  pivot: GameMission;
}
