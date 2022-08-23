export default interface PaginateResponseDto<T> {
  data: T[];

  from?: number;
  last_page?: number;
  current_page?: number;
  per_page?: number;
  total?: number;

  // present if response is Laravel resource
  // e.g.AutomationResource:: (Automation:: paginate())
  meta?: {
    from: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
