import axios from "axios";
import LoginDto from "../dtos/login-dto";
import AbstractService from "./abstract-service";

export default class AuthService extends AbstractService {
  public async login(payload: { username: string; password: string }) {
    const { data } = await axios.post<LoginDto>(
      `${this.apiUrl}/auth/login`,
      payload
    );
    return data;
  }
}
