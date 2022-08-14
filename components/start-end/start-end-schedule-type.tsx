import { ComponentProps, ComponentType } from "react";
import { UseFormRegister } from "react-hook-form";
import { StartEndFormValues } from "./start-end-form";

interface IStartEndScheduleType {
  register: UseFormRegister<StartEndFormValues>;
  isLoading: boolean;
}

const StartEndScheduleType: ComponentType<
  ComponentProps<"div"> & IStartEndScheduleType
> = ({ register, isLoading, ...rest }) => {
  return (
    <section {...rest}>
      <section className="form-control w-full">
        <label className="label">
          <span className="label-text">Start Time</span>
        </label>
        <input
          {...register("start_time")}
          type="datetime-local"
          className="input input-bordered col-span-12 sm:col-span-8 xl:col-span-10"
          required
        />
        <label className="label">
          <span className="label-text-alt">Enter or select a date & time</span>
        </label>
      </section>

      <section className="form-control w-full">
        <label className="label">
          <span className="label-text">End Time</span>
        </label>
        <input
          {...register("end_time")}
          type="datetime-local"
          className="input input-bordered col-span-12 sm:col-span-8 xl:col-span-10"
          required
        />
        <label className="label">
          <span className="label-text-alt">Enter or select a date & time</span>
        </label>
      </section>

      <section className="card my-4 bg-primary-content shadow-xl">
        <div className="card-body">
          At the Start Time, Missions will be released for participants to see
          in the app. Missions can be completed as long as the Experience is
          active.
        </div>
      </section>
    </section>
  );
};

export default StartEndScheduleType;
