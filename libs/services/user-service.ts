import PaginateRequestDto from "../dtos/paginate-request-dto";
import PaginateResponseDto from "../dtos/paginate-response-dto";
import User from "../models/user";
import AbstractService from "./abstract-service";

export default class UserService extends AbstractService {
  public async search(params: PaginateRequestDto & { admin: boolean }) {
    const { data } = await this.axios.get<PaginateResponseDto<User>>(
      `${this.apiUrl}/users`,
      { params }
    );
    return data;
  }
}
