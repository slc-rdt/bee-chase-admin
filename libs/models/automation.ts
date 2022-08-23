import { AutomationTimeType, AutomationType } from "../enums";
import BaseModel from "./base-model";

export default interface Automation extends BaseModel {
  game_id: string;
  name: string;
  type: AutomationType;
  when_type: AutomationTimeType;
  automation_data: AutomationData | string;
  when_happened?: Date | string;
  relative_time?: number;
  has_executed: boolean;
}

interface AutomationData {
  message?: string; // AutomationType is NOTIFY_ALL_USERS
  mission_ids?: string[]; // AutomationType is not NOTIFY_ALL_USERS
}
