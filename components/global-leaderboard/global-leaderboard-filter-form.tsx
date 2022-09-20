import {
  ComponentProps,
  ComponentType
} from "react";
import { UseFormRegister } from "react-hook-form";
import Tag from "../../libs/models/tag";
import { IGlobalLeaderboardFilterFormValues } from "../../pages/global-leaderboard";

interface IGlobalLeaderboardFilterForm {
  register: UseFormRegister<IGlobalLeaderboardFilterFormValues>;
  tags: Tag[];
}

const GlobalLeaderboardFilterForm: ComponentType<
  ComponentProps<"section"> & IGlobalLeaderboardFilterForm
> = ({ register, tags }) => {
  return (
    <section>
      <section className="form-control mb-4 w-full">
        <label className="label">
          <span className="label-text">Leaderboard Tag</span>
        </label>
        <select {...register("tagId")} className="select select-bordered">
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <label className="label">
          <span className="label-text-alt">
            Choose a tag to filter the leaderboard.
          </span>
        </label>
      </section>

      <section className="flex flex-wrap gap-4">
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">From</span>
          </label>
          <input
            {...register("startDate")}
            type="date"
            className="input input-bordered"
          />
          <label className="label">
            <span className="label-text-alt">
              Choose start date to filter the leaderboard.
            </span>
          </label>
        </div>

        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">To</span>
          </label>
          <input
            {...register("endDate")}
            type="date"
            className="input input-bordered"
          />
          <label className="label">
            <span className="label-text-alt">
              Choose end date to filter the leaderboard.
            </span>
          </label>
        </div>
      </section>
    </section>
  );
};

export default GlobalLeaderboardFilterForm;
