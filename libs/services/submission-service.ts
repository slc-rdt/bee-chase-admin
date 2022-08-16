import PaginateResponseDto from "../dtos/paginate-response-dto";
import Submission from "../models/submission";
import AbstractService from "./abstract-service";

export default class SubmissionService extends AbstractService {
  public async getAllPaginated(
    gameId: string,
    missionId: string,
    page: number
  ) {
    const { data } = await this.axios.get<PaginateResponseDto<Submission>>(
      `${this.apiUrl}/games/${gameId}/missions/${missionId}/submissions`,
      { params: { page } }
    );

    return data;
  }
}
