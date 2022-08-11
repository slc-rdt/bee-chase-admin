export default interface User {
  id: string;
  username: string;
  binusian_id: string;
  picture_id: string;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: Date;
  deleted_at?: Date;
}
