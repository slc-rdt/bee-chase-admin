import { GameTeamFormValues } from "../../components/participants/game-team-form";
import PaginateResponseDto from "../dtos/paginate-response-dto";
import { AnswerTypes } from "../enums";
import GameTeam from "../models/game-team";
import Submission from "../models/submission";
import AbstractService from "./abstract-service";

export default class GameTeamService extends AbstractService {
  public async getAll(gameId: string) {
    const { data } = await this.axios.get<GameTeam[]>(
      `${this.apiUrl}/games/${gameId}/game_teams`
    );
    return data;
  }

  public async getOneById(gameId: string, gameTeamId: string) {
    const { data } = await this.axios.get<GameTeam>(
      `${this.apiUrl}/games/${gameId}/game_teams/${gameTeamId}`
    );
    return data;
  }

  public async getSubmissionsPaginatedByMissionAnswerType(
    gameId: string,
    gameTeamId: string,
    params: { page: number; answer_type: AnswerTypes }
  ) {
    const { data } = await this.axios.get<PaginateResponseDto<Submission>>(
      `${this.apiUrl}/games/${gameId}/game_teams/${gameTeamId}/submissions`,
      { params }
    );
    return data;
  }

  public async create(payload: GameTeamFormValues) {
    const { data } = await this.axios.post<GameTeam>(
      `${this.apiUrl}/games/${payload.game_id}/game_teams`,
      payload
    );
    return data;
  }

  public async update(payload: GameTeam) {
    const { data } = await this.axios.put<GameTeam>(
      `${this.apiUrl}/games/${payload.game_id}/game_teams/${payload.id}`,
      payload
    );
    return data;
  }

  public async delete(payload: GameTeam) {
    const { data } = await this.axios.delete<GameTeam>(
      `${this.apiUrl}/games/${payload.game_id}/game_teams/${payload.id}`
    );
    return data;
  }
}
