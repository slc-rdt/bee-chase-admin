export default interface BaseModel {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string;
}
