import PaginateResponseDto from "../dtos/paginate-response-dto";

export default function getCurrentPageIndexFromPagination(
  index: number,
  pagination: PaginateResponseDto<any>
) {
  const page = pagination.current_page ?? pagination.current_page ?? -1;
  const perPage = pagination.per_page ?? pagination.meta?.per_page ?? -1;

  // start from 16 if page 2, etc...
  const pageOffset = (page - 1) * perPage;
  return index + pageOffset;
}
