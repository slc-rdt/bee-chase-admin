import GameTeam from "../models/game-team";
import AbstractService from "./abstract-service";

export default class GameTeamService extends AbstractService {
  public async create(payload: GameTeam) {
    const { data } = await this.axios.post<GameTeam>(
      `${this.apiUrl}/games/${payload.game_id}/game_teams`,
      payload
    );
    return data;
  }
}
