import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import useLoading from "../../libs/hooks/common/use-loading";

interface ISearchBar {
  pathname: string;
  queryString?: string;
  onSearch?: (keyword: string) => void;
}

const SearchBar: ComponentType<ComponentProps<"section"> & ISearchBar> = ({
  pathname,
  queryString,
  onSearch,
  className,
  ...rest
}) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ keyword: string }>();
  const { isLoading, doAction } = useLoading();

  const onSubmit = handleSubmit((data) => {
    const queryStringParameter = queryString ?? "q";

    doAction(
      router.push({
        pathname,
        query: {
          ...router.query,
          [queryStringParameter]: data.keyword,
        },
      })
    );
  });

  return (
    <section className={`form-control ${className}`} {...rest}>
      <form onSubmit={onSubmit} className="input-group">
        <input
          {...register("keyword")}
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`btn btn-square btn-primary ${
            isLoading && "btn-square loading"
          }`}
        >
          {!isLoading && <MagnifyingGlassIcon className="h-6 w-6" />}
        </button>
      </form>
    </section>
  );
};

export default SearchBar;
