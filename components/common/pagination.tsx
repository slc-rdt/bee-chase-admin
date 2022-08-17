import { useRouter } from "next/router";
import { ComponentProps, useCallback, useEffect } from "react";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import PaginationButtons from "./pagination-buttons";

interface IPagination<T> extends ComponentProps<"section"> {
  currentPage: number;
  pagination: PaginateResponseDto<T>;
  render: (data: T) => JSX.Element;
}

const Pagination = <T extends unknown>({
  currentPage,
  pagination,
  render,
  ...rest
}: IPagination<T>) => {
  return (
    <>
      <section className="my-4 grid grid-cols-1 gap-4" {...rest}>
        {pagination.data.length === 0 && (
          <div className="card shadow-xl">
            <div className="card-body">
              <h2 className="font-lg text-center font-medium">No data.</h2>
            </div>
          </div>
        )}

        {pagination.data.map(render)}
      </section>

      <div className="my-4" />

      <PaginationButtons
        length={pagination.last_page}
        currentPage={currentPage}
      />
    </>
  );
};

export default Pagination;
