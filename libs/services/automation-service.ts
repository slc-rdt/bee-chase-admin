import PaginateRequestDto from "../dtos/paginate-request-dto";
import PaginateResponseDto from "../dtos/paginate-response-dto";
import Automation from "../models/automation";
import AbstractService from "./abstract-service";

export default class AutomationService extends AbstractService {
  public async getAllPaginated(gameId: string, params: PaginateRequestDto) {
    const { data } = await this.axios.get<PaginateResponseDto<Automation>>(
      `${this.apiUrl}/games/${gameId}/automations`,
      { params }
    );
    return data;
  }

  public async create(gameId: string, payload: Automation) {
    const { data } = await this.axios.post<Automation>(
      `${this.apiUrl}/games/${gameId}/automations`,
      {
        ...payload,
        automation_data: JSON.stringify(payload.automation_data),
      }
    );
    return data;
  }
}
