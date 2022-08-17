import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType, useCallback, useEffect } from "react";

interface IPaginationButtons {
  currentPage: number;
  length: number;
}

const PaginationButtons: ComponentType<
  ComponentProps<"section"> & IPaginationButtons
> = ({ currentPage, length, ...rest }) => {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < length;

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
    if (currentPage > length || currentPage < 1) {
      onChangePage(1);
    }
  }, [currentPage, length, onChangePage]);

  return (
    <>
      {/* Mobile */}
      <section className="btn-group flex justify-end sm:hidden" {...rest}>
        <button
          onClick={() => onChangePage(currentPage - 1)}
          disabled={!hasPrev}
          className="btn btn-secondary"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <button className="btn btn-ghost">
          {currentPage} / {length}
        </button>

        <button
          onClick={() => onChangePage(currentPage + 1)}
          disabled={!hasNext}
          className="btn btn-secondary"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </section>

      {/* Desktop */}
      <section className="hidden justify-end sm:flex" {...rest}>
        <section className="btn-group">
          <button
            onClick={() => onChangePage(1)}
            disabled={!hasPrev}
            className="btn btn-secondary"
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onChangePage(currentPage - 1)}
            disabled={!hasPrev}
            className="btn btn-secondary"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </section>

        <section className="form-control mx-4">
          <div className="input-group">
            <select
              onChange={(e) => onChangePage(Number(e.target.value))}
              className="select select-bordered"
              value={currentPage}
            >
              {Array.from({ length }).map((_, idx) => {
                const page = idx + 1;
                return (
                  <option key={page} value={page}>
                    {page}
                  </option>
                );
              })}
            </select>
            <button className="btn btn-secondary">of {length}</button>
          </div>
        </section>

        <section className="btn-group">
          <button
            onClick={() => onChangePage(currentPage + 1)}
            disabled={!hasNext}
            className="btn btn-secondary"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onChangePage(length)}
            disabled={!hasNext}
            className="btn btn-secondary"
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </section>
      </section>
    </>
  );
};

export default PaginationButtons;
