import CreateTagDto from "../dtos/create-tag-dto";
import Tag from "../models/tag";
import AbstractService from "./abstract-service";

export default class TagService extends AbstractService {
  public async getAll() {
    const { data } = await this.axios.get<Tag[]>(`${this.apiUrl}/tags`);
    return data;
  }

  public async create(payload: CreateTagDto) {
    const { data } = await this.axios.post<Tag>(`${this.apiUrl}/tags`, payload);
    return data;
  }
}
