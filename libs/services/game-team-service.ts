import GameTeam from "../models/game-team";
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

  public async create(payload: GameTeam) {
    const { data } = await this.axios.post<GameTeam>(
      `${this.apiUrl}/games/${payload.game_id}/game_teams`,
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
