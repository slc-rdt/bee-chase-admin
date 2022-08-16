import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import PaginationButtons from "./pagination-buttons";

interface IPagination<T> {
  currentPage: number;
  pagination: PaginateResponseDto<T>;
  render: (data: T) => JSX.Element;
}

const Pagination = <T extends unknown>({
  currentPage,
  pagination,
  render,
}: IPagination<T>) => {
  const router = useRouter();

  const onChangePage = useCallback(
    (page: number) => {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          page,
        },
      });
    },
    [router]
  );

  useEffect(() => {
    if (currentPage > pagination.last_page || currentPage < 1) {
      onChangePage(1);
    }
  }, [currentPage, onChangePage, pagination.last_page]);

  return (
    <section className="mt-4 grid grid-cols-1 gap-4">
      {pagination.data.length === 0 && (
        <div className="card shadow-xl">
          <div className="card-body">
            <h2 className="font-lg text-center font-medium">No data.</h2>
          </div>
        </div>
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
