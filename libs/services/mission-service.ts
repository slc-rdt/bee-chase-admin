import { ParsedUrlQuery } from "querystring";
import CreateMissionDto from "../dtos/create-mission-dto";
import PaginateRequestDto from "../dtos/paginate-request-dto";
import PaginateResponseDto from "../dtos/paginate-response-dto";
import UpdateMissionDto from "../dtos/update-mission-dto";
import Mission from "../models/mission";
import MissionCode from "../models/mission-code";
import parseStringIfJson from "../utils/parse-string-if-json";
import AbstractService from "./abstract-service";

export default class MissionService extends AbstractService {
  public async getAll(gameId: string) {
    const { data } = await this.axios.get<Mission[]>(
      `${this.apiUrl}/games/${gameId}/missions`
    );
    return data;
  }

  public async getAllPaginated(
    gameId: string,
    payload: PaginateRequestDto | ParsedUrlQuery
  ) {
    const { data } = await this.axios.get<PaginateResponseDto<Mission>>(
      `${this.apiUrl}/games/${gameId}/missions`,
      {
        params: payload,
      }
    );
    return data;
  }

  public async getOneById(gameId: string, missionId: string) {
    const { data } = await this.axios.get<Mission>(
      `${this.apiUrl}/games/${gameId}/missions/${missionId}`
    );
    return data;
  }

  public async getVerificationCode(
    gameId: string,
    missionId: string,
    params: { duration: number; withMission: boolean; }
  ) {
    const { data } = await this.axios.get<MissionCode>(
      `${this.apiUrl}/games/${gameId}/missions/${missionId}/generate-code`,
      { params }
    );
    return data;
  }

  public async create(gameId: string, payload: CreateMissionDto) {
    const { data } = await this.axios.post<Mission>(
      `${this.apiUrl}/games/${gameId}/missions`,
      {
        ...payload,
        // Laravel validates JSON type as string, so we must stringify this first
        // else Laravel will recognize it as empty string \ :v /
        mission_data: parseStringIfJson(payload.mission_data),
      }
    );
    return data;
  }

  public async update(gameId: string, payload: UpdateMissionDto) {
    const { data } = await this.axios.put<Mission>(
      `${this.apiUrl}/games/${gameId}/missions/${payload.id}`,
      {
        ...payload,
        // Laravel validates JSON type as string, so we must stringify this first
        // else Laravel will recognize it as empty string \ :v /
        mission_data: parseStringIfJson(payload.mission_data),
      }
    );
    return data;
  }

  public async delete(gameId: string, mission: Mission) {
    const { data } = await this.axios.delete<Mission>(
      `${this.apiUrl}/games/${gameId}/missions/${mission.id}`
    );
    return data;
  }

  public async swapMissionIndex(mission: Mission, mission_dest_idx: number) {
    const { data } = await this.axios.patch(
      `${this.apiUrl}/games/${mission.game_id}/missions/${mission.id}/swap`,
      { mission_dest_idx }
    );
    return data;
  }
}
