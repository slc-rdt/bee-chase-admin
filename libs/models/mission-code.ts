import BaseModel from "./base-model";
import Mission from "./mission";

export default interface MissionCode extends BaseModel {
  mission_id: string;
  mission?: Mission;
  code: string;
  expired_time: string;
}
