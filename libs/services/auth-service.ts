import axios from "axios";
import { User } from "next-auth";
import AbstractService from "./abstract-service";

export default class AuthService extends AbstractService {
  public async login(payload: { username: string; password: string }) {
    const { data } = await axios.post<User>(
      `${this.apiUrl}/auth/login`,
      payload
    );
    return data;
  }
}
