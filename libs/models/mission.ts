import BaseModel from "./base-model";

interface MissionData {
  accepted_answers?: string[];
  latitude?: number;
  longitude?: number;
}

export default interface Mission extends BaseModel {
  name: string;
  point_value: number;
  description: string;
  attached_image_link: string;
  attached_link: string;
  shown_in_feed: boolean;
  answer_type: number;
  mission_data: MissionData;
}
