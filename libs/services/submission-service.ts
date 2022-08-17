import PaginateResponseDto from "../dtos/paginate-response-dto";
import Submission from "../models/submission";
import AbstractService from "./abstract-service";

export default class SubmissionService extends AbstractService {
  public async getAllPaginatedByMission(
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

  public async delete(submission: Submission) {
    const gameId = (submission.mission ?? submission.game_team)?.game_id;
    const { data } = await this.axios.delete<PaginateResponseDto<Submission>>(
      `${this.apiUrl}/games/${gameId}/missions/${submission.mission_id}/submissions/${submission.id}`
    );
    return data;
  }
}
