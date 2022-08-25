import { AutomationFormValues } from "../../components/automation/automation-form";
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

  public async getOneById(gameId: string, automationId: string) {
    const { data } = await this.axios.get<Automation>(
      `${this.apiUrl}/games/${gameId}/automations/${automationId}`
    );
    return data;
  }

  public async create(gameId: string, payload: AutomationFormValues) {
    const { data } = await this.axios.post<Automation>(
      `${this.apiUrl}/games/${gameId}/automations`,
      {
        ...payload,
        automation_data: JSON.stringify(payload.automation_data),
      }
    );
    return data;
  }

  public async update(automation: Automation) {
    const { data } = await this.axios.put<Automation>(
      `${this.apiUrl}/games/${automation.game_id}/automations/${automation.id}`,
      {
        ...automation,
        automation_data: JSON.stringify(automation.automation_data),
      }
    );
    return data;
  }

  public async delete(automation: Automation) {
    const { data } = await this.axios.delete<Automation>(
      `${this.apiUrl}/games/${automation.game_id}/automations/${automation.id}`
    );
    return data;
  }
}
