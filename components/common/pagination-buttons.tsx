import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid";
import React, { ComponentProps, ComponentType } from "react";

interface IPaginationButtons {
  currentPage: number;
  length: number;
  onChangePage: (page: number) => void;
}

const PaginationButtons: ComponentType<
  ComponentProps<"section"> & IPaginationButtons
> = ({ currentPage, length, onChangePage, ...rest }) => {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < length;

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
      <section className="btn-group hidden justify-end sm:flex" {...rest}>
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

        <section className="form-control mx-4">
          <div className="input-group">
            <select
              onChange={(e) => onChangePage(Number(e.target.value))}
              className="select select-bordered"
            >
              {Array.from({ length }).map((_, idx) => {
                const page = idx + 1;
                return (
                  <option
                    key={page}
                    value={page}
                    selected={currentPage === page}
                  >
                    {page}
                  </option>
                );
              })}
            </select>
            <button className="btn btn-secondary">of {length}</button>
          </div>
        </section>

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
    </>
  );
};

export default PaginationButtons;
