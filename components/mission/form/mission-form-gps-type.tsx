import { ComponentProps, ComponentType } from "react";
import { UseFormRegister } from "react-hook-form";
import { MissionFormValues } from "./mission-form";

interface IMissionFormGpsType {
  register: UseFormRegister<MissionFormValues>;
  isLoading: boolean;
}

const MissionFormGpsType: ComponentType<
  ComponentProps<"div"> & IMissionFormGpsType
> = ({ register, isLoading, ...rest }) => {
  return (
    <div className="grid grid-cols-12 gap-4" {...rest}>
      <section className="form-control col-span-12 sm:col-span-4">
        <label className="label">
          <span className="label-text">Latitude</span>
        </label>
        <input
          {...register("mission_data.latitude")}
          type="number"
          step="any"
          disabled={isLoading}
          className="input input-bordered w-full"
          required
        />
      </section>

      <section className="form-control col-span-12 sm:col-span-4">
        <label className="label">
          <span className="label-text">Longitude</span>
        </label>
        <input
          {...register("mission_data.longitude")}
          type="number"
          step="any"
          disabled={isLoading}
          className="input input-bordered w-full"
          required
        />
      </section>

      <section className="form-control col-span-12 sm:col-span-4">
        <label className="label">
          <span className="label-text">Radius</span>
        </label>
        <label className="input-group">
          <input
            {...register("mission_data.radius")}
            type="number"
            step="50"
            disabled={isLoading}
            className="input input-bordered w-full"
            required
            min={50}
          />
          <span>Meters</span>
        </label>
      </section>
    </div>
  );
};

export default MissionFormGpsType;
