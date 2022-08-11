import CreateMissionDto from "../dtos/create-mission-dto";
import Mission from "../models/mission";
import AbstractService from "./abstract-service";

export default class MissionService extends AbstractService {
  public async create(gameId: string, payload: CreateMissionDto) {
    const { data } = await this.axios.post<Mission>(
      `${this.apiUrl}/games/${gameId}/missions`,
      {
        ...payload,
        // Laravel validates JSON type as string, so we must stringify this first
        // else Laravel will recognize it as empty string \ :v /
        mission_data: JSON.stringify(payload.mission_data),
      }
    );
    return data;
  }
}
