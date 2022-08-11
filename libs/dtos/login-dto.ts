import User from "../models/user";

export default interface LoginDto extends User {
  access_token: string;
}
