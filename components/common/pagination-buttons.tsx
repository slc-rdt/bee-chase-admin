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
    <section className="btn-group justify-end" {...rest}>
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
                <option key={page} value={page} selected={currentPage === page}>
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

      {/* <button type="button" onClick={() => onChangePage(1)} className="btn">
        1
      </button>

      {Array.from({ length: buttonsCount }).map((_, idx) => {
        const number = idx + 1;
        return (
          <button
            key={number}
            type="button"
            onClick={() => onChangePage(number)}
            className={`btn ${currentPage === number && "btn-active"}`}
          >
            {number}
          </button>
        );
      })}

      {length && length > 1 && (
        <button
          type="button"
          onClick={() => onChangePage(length ?? 1)}
          className="btn"
        >
          {length}
        </button>
      )} */}
    </section>
  );
};

export default PaginationButtons;
