import User from "../models/user";
import AbstractService from "./abstract-service";

export default class UserService extends AbstractService {
  public async search(keyword: string) {
    const { data } = await this.axios.get<User[]>(`${this.apiUrl}/users`, {
      params: {
        search: keyword,
      },
    });
    return data;
  }
}
