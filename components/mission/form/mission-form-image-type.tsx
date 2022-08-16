import React, { ComponentProps, ComponentType } from "react";
import { UseFormRegister } from "react-hook-form";
import { MediaType, SubmissionSource } from "../../../libs/enums";
import { MissionFormValues } from "./mission-form";

interface IMissionFormImageType {
  register: UseFormRegister<MissionFormValues>;
  isLoading: boolean;
}

const MissionFormImageType: ComponentType<IMissionFormImageType> = ({
  register,
  isLoading,
}) => {
  const transformLabel = (label: string) =>
    label.toLowerCase().replaceAll("_", " ");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section className="form-control w-full">
        <label className="label">
          <span className="label-text">Media</span>
        </label>
        <select
          {...register("mission_data.media_type")}
          className="select select-bordered w-full capitalize"
          disabled={isLoading}
        >
          {Object.entries(MediaType)
            .filter(([_, value]) => typeof value === "number")
            .map(([type, value]) => (
              <option key={type} value={value}>
                {transformLabel(type)}
              </option>
            ))}
        </select>
      </section>

      <section className="form-control w-full">
        <label className="label">
          <span className="label-text">Submission Source</span>
        </label>
        <select
          {...register("mission_data.media_type")}
          className="select select-bordered w-full capitalize"
          disabled={isLoading}
        >
          {Object.entries(SubmissionSource)
            .filter(([_, value]) => typeof value === "number")
            .map(([type, value]) => (
              <option key={type} value={value}>
                {transformLabel(type)}
              </option>
            ))}
        </select>
      </section>
    </div>
  );
};

export default MissionFormImageType;
