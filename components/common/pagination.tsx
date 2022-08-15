import { useRouter } from "next/router";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import PaginationButtons from "./pagination-buttons";

interface IPagination<T> {
  currentPage?: number;
  pagination: PaginateResponseDto<T>;
  render: (data: T) => JSX.Element;
}

const Pagination = <T extends unknown>({
  currentPage,
  pagination,
  render,
}: IPagination<T>) => {
  const router = useRouter();

  const onChangePage = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page,
      },
    });
  };

  return (
    <section className="mt-4 grid grid-cols-1 gap-4">
      {pagination.data.length === 0 && (
        <h2 className="font-lg text-center font-medium">No data.</h2>
      )}

      {pagination.data.map(render)}

      <PaginationButtons
        length={pagination.last_page}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    </section>
  );
};

export default Pagination;
