import BaseModel from "./base-model";

export default interface User extends BaseModel {
  access_token: string;
  username: string;
  binusian_id: string;
  picture_id: string;
  picture_url: string;
  name: string;
  email: string;
  is_admin: boolean;
}
