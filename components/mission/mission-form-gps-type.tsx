import { ComponentProps, ComponentType } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface IMissionFormGpsType {
  registerLatFn: () => UseFormRegisterReturn<"mission_data.latitude">;
  registerLongFn: () => UseFormRegisterReturn<"mission_data.longitude">;
  isLoading: boolean;
}

const MissionFormGpsType: ComponentType<
  ComponentProps<"div"> & IMissionFormGpsType
> = ({ registerLatFn, registerLongFn, isLoading, ...rest }) => {
  return (
    <div className="grid grid-cols-12 gap-4" {...rest}>
      <section className="form-control col-span-12 sm:col-span-6">
        <label className="label">
          <span className="label-text">Latitude (Optional)</span>
        </label>
        <input
          {...registerLatFn()}
          type="number"
          step="any"
          disabled={isLoading}
          className="input input-bordered w-full"
        />
      </section>
      <section className="form-control col-span-12 sm:col-span-6">
        <label className="label">
          <span className="label-text">Longitude (Optional)</span>
        </label>
        <input
          {...registerLongFn()}
          type="number"
          step="any"
          disabled={isLoading}
          className="input input-bordered w-full"
        />
      </section>
    </div>
  );
};

export default MissionFormGpsType;
