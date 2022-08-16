import React, { ComponentProps, ComponentType } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { AvailabilityTypes } from "../../../libs/enums";
import Mission from "../../../libs/models/mission";
import { MissionFormValues } from "./mission-form";

interface IMissionFormChooseAvailability {
  register: UseFormRegister<MissionFormValues>;
  watch: UseFormWatch<MissionFormValues>;
  isLoading: boolean;
  mission?: Mission;
}

const MissionFormChooseAvailability: ComponentType<
  ComponentProps<"section"> & IMissionFormChooseAvailability
> = ({ register, watch, isLoading, mission, ...rest }) => {
  const availability = Number(watch("availability"));

  return (
    <section className="form-control w-full" {...rest}>
      <label className="label">
        <span className="label-text">Mission Availability</span>
      </label>
      <select
        {...register("availability")}
        className="select select-bordered w-full capitalize"
        disabled={isLoading}
        defaultValue={mission?.availability}
      >
        {Object.entries(AvailabilityTypes)
          .filter(([_, value]) => typeof value === "number")
          .map(([type, value]) => (
            <option key={type} value={value}>
              {type.toLowerCase()}
            </option>
          ))}
      </select>
      <label className="label">
        <span className="label-text">
          {availability === AvailabilityTypes.AVAILABLE &&
            "Participants can see and complete this Mission when the Game is live."}
          {availability === AvailabilityTypes.HIDDEN &&
            "Participants can't see or complete this Mission when the Game is live."}
          {availability === AvailabilityTypes.EXPIRED &&
            "Participants can see but not complete this Mission when the Game is live."}
        </span>
      </label>
    </section>
  );
};

export default MissionFormChooseAvailability;
