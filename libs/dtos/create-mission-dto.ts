import MissionData from "../models/mission-data";

export default interface CreateMissionDto {
  name: string;
  point_value: number;
  description: string;
  attached_image_link: string;
  attached_link: string;
  shown_in_feed: boolean;
  answer_type: number;
  mission_data: MissionData;
  availability: number;
  parent_mission_id?: string;
}
