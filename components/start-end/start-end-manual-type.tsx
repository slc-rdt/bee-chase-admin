import { ComponentProps, ComponentType } from "react";
import { UseFormRegister } from "react-hook-form";
import { StartEndFormValues } from "./start-end-form";

interface IStartEndManualType {
  register: UseFormRegister<StartEndFormValues>;
  isLoading: boolean;
}

const durationTypes = ["minutes", "hours", "days"];

const StartEndManualType: ComponentType<
  ComponentProps<"div"> & IStartEndManualType
> = ({ register, isLoading, ...rest }) => {
  return (
    <section {...rest}>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Set a duration</span>
        </label>

        <div className="grid grid-cols-12 gap-4">
          <input
            {...register("duration_value")}
            type="number"
            placeholder="Enter duration value"
            className="input input-bordered col-span-12 sm:col-span-8 xl:col-span-10"
            min={1}
            required
          />

          <select
            {...register("duration_type")}
            className="select select-bordered col-span-12 capitalize sm:col-span-4 xl:col-span-2"
            placeholder="Select duration type"
          >
            {durationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <label className="label">
          <span className="label-text-alt">
            Clicking "Start Experience" releases the Missions for all
            participants to see and complete.
          </span>
        </label>
      </div>
    </section>
  );
};

export default StartEndManualType;
