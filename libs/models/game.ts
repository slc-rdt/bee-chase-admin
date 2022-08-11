import BaseModel from "./base-model";

export default interface Game extends BaseModel {
  access_code: string;
  name: string;
  description: string;
  password: string;
  start_time: Date;
  end_time: Date;
}
