import BaseModel from "./base-model";

export default interface User extends BaseModel {
  username: string;
  binusian_id: string;
  picture_id: string;
  name: string;
  email: string;
  is_admin: boolean;
}
