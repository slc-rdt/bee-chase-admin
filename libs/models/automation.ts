import { AutomationTimeType, AutomationType } from "../enums";
import AutomationData from "./automation-data";
import BaseModel from "./base-model";
import Mission from "./mission";

export default interface Automation extends BaseModel {
  game_id: string;
  name: string;
  type: AutomationType;
  when_type: AutomationTimeType;
  automation_data: AutomationData | string;
  when_happened?: Date | string;
  relative_time?: number;
  has_executed: boolean;
  missions?: Mission[]; // from automation_data.mission_ids
}
