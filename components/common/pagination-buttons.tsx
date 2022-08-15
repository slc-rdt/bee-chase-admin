import React, { ComponentProps, ComponentType } from "react";

interface IPaginationButtons {
  currentPage?: number;
  length?: number;
  onChangePage: (page: number) => void;
}

const PaginationButtons: ComponentType<
  ComponentProps<"section"> & IPaginationButtons
> = ({ currentPage, length, onChangePage, ...rest }) => {
  return (
    <section className="btn-group justify-end" {...rest}>
      {Array.from({ length: length ?? 0 }).map((_, idx) => {
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
    </section>
  );
};

export default PaginationButtons;
