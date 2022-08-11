import CreateGameDto from "../dtos/create-game-dto";
import PaginateRequestDto from "../dtos/paginate-request-dto";
import PaginateResponseDto from "../dtos/paginate-response-dto";
import Game from "../models/game";
import AbstractService from "./abstract-service";

export default class GameService extends AbstractService {
  public async getAllPaginated({ page }: PaginateRequestDto) {
    const { data } = await this.axios.get<PaginateResponseDto<Game>>(
      `${this.apiUrl}/games`,
      { params: { page } }
    );
    return data;
  }

  public async getOneById(id: string) {
    const { data } = await this.axios.get<Game>(`${this.apiUrl}/games/${id}`);
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
}
