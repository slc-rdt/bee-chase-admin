export default interface PaginateResponseDto<T> {
  data: T[];
  from: number;
  last_page: number;
  current_page: number;
  per_page: 15;
  total: number;
}
