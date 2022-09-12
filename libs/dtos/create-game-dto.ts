export default interface CreateGameDto {
  name: string;
  description: string;
  password: string;
  tag_id: string | null;
  tag_name: string;
}
