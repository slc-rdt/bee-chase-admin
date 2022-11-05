import CreateGameDto from "../dtos/create-game-dto";
import PaginateRequestDto from "../dtos/paginate-request-dto";
import PaginateResponseDto from "../dtos/paginate-response-dto";
import Game from "../models/game";
import GameTeam from "../models/game-team";
import User from "../models/user";
import AbstractService from "./abstract-service";

export default class GameService extends AbstractService {
  public async getAll() {
    const { data } = await this.axios.get<Game[]>(`${this.apiUrl}/games`);
    return data;
  }

  public async getAllPaginated(
    payload: PaginateRequestDto & { withTag?: boolean }
  ) {
    const { data } = await this.axios.get<PaginateResponseDto<Game>>(
      `${this.apiUrl}/games`,
      { params: payload }
    );
    return data;
  }

  public async getOneById(id: string) {
    const { data } = await this.axios.get<Game>(`${this.apiUrl}/games/${id}`);
    return data;
  }

  public async getLeaderboard(gameId: string, params: PaginateRequestDto) {
    const { data } = await this.axios.get<GameTeam[]>(
      `${this.apiUrl}/games/${gameId}/leaderboard`,
      { params }
    );
    return data;
  }

  public async create(payload: CreateGameDto) {
    const { data } = await this.axios.post<Game>(
      `${this.apiUrl}/games`,
      payload
    );
    return data;
  }

  public async update(game: Game) {
    const { data } = await this.axios.put<Game>(
      `${this.apiUrl}/games/${game.id}`,
      game
    );
    return data;
  }

  public async delete(game: Game) {
    const { data } = await this.axios.delete<Game>(
      `${this.apiUrl}/games/${game.id}`
    );
    return data;
  }

  public async addAdmin(game: Game, user: User) {
    const { data } = await this.axios.post<Game>(
      `${this.apiUrl}/games/${game.id}/admins/${user.id}`
    );
    return data;
  }

  public async removeAdmin(game: Game, user: User) {
    const { data } = await this.axios.delete<Game>(
      `${this.apiUrl}/games/${game.id}/admins/${user.id}`
    );
    return data;
  }

  public async clone(gameId: string) {
    const { data } = await this.axios.post<Game>(
      `${this.apiUrl}/games/${gameId}/clone`,
      { gameId }
    );
    return data;
  }

  public async exportGames() {
    return await this.getBlob(`${this.apiUrl}/games/export_excel`);
  }

  public async exportLeaderboard(gameId: string) {
    return await this.getBlob(
      `${this.apiUrl}/games/${gameId}/leaderboard/export_excel`
    );
  }

  public async exportSubmissions(gameId: string) {
    return await this.getBlob(
      `${this.apiUrl}/games/${gameId}/submissions/export_excel`
    );
  }
}
