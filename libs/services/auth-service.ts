import axios from "axios";
import User from "../models/user";
import AbstractService from "./abstract-service";

export default class AuthService extends AbstractService {
  public async login(payload: { username: string; password: string }) {
    const { data } = await axios.post<User>(
      `${this.apiUrl}/auth/login`,
      payload
    );
    return data;
  }

  public async me(accessToken: string) {
    const { data } = await axios.get<User>(
      `${this.apiUrl}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  }
}
