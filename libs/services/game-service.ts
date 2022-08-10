import axios from "axios";
import CreateGameDto from "../dtos/create-game-dto";
import Game from "../models/game";
import AbstractService from "./abstract-service";

export default class GameService extends AbstractService {
  public async create(payload: CreateGameDto) {
    const { data } = await axios.post<Game>(`${this.apiUrl}/games`, payload);
    return data;
  }
}
