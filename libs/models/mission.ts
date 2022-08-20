import BaseModel from "./base-model";
import Submission from "./submission";

export default interface Mission extends BaseModel {
  game_id: string;
  name: string;
  point_value: number;
  description: string;
  attached_image_link: string;
  attached_link: string;
  shown_in_feed: boolean;
  answer_type: number;
  availability: number;
  mission_data: string;
  submissions?: Submission[];
  parent_mission_id?: string;
}
