import BaseModel from "./base-model";

export default interface MissionCode extends BaseModel {
  mission_id: string;
  code: string;
  expired_time: string;
}
