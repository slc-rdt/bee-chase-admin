import PaginateResponseDto from "../dtos/paginate-response-dto";
import User from "../models/user";
import AbstractService from "./abstract-service";

export default class UserService extends AbstractService {
  public async search(payload: { search: string; page: number }) {
    const { data } = await this.axios.get<PaginateResponseDto<User>>(
      `${this.apiUrl}/users`,
      { params: payload }
    );
    return data;
  }
}
