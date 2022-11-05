import CreateTagDto from "../dtos/create-tag-dto";
import PaginateRequestDto from "../dtos/paginate-request-dto";
import GlobalLeaderboardItem from "../models/global-leaderboard-item";
import Tag from "../models/tag";
import AbstractService from "./abstract-service";

export default class TagService extends AbstractService {
  public async getGlobalLeaderboard(
    tag: Tag,
    params: PaginateRequestDto & { start_date?: string; end_date?: string }
  ) {
    const { data } = await this.axios.get<GlobalLeaderboardItem[]>(
      `${this.apiUrl}/tags/${tag.id}/leaderboard`,
      { params }
    );
    return data;
  }

  public async getAll() {
    const { data } = await this.axios.get<Tag[]>(`${this.apiUrl}/tags`);
    return data;
  }

  public async create(payload: CreateTagDto) {
    const { data } = await this.axios.post<Tag>(`${this.apiUrl}/tags`, payload);
    return data;
  }

  public async exportGlobalLeaderboard(
    tag: Tag,
    params: { start_date: string; end_date: string }
  ) {
    return await this.getBlob(
      `${this.apiUrl}/tags/${tag.id}/leaderboard/export_excel`,
      { params }
    );
  }
}
