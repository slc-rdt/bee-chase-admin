import { ComponentProps, ComponentType } from "react";
import { UseFormRegister } from "react-hook-form";
import { AnswerTypes } from "../../../libs/enums";
import Mission from "../../../libs/models/mission";
import normalizeConstantCase from "../../../libs/utils/normalize-constant-case";
import { MissionFormValues } from "./mission-form";

interface IMissionFormChooseAnswerType {
  register: UseFormRegister<MissionFormValues>;
  isLoading: boolean;
  mission?: Mission;
}

const MissionFormChooseAnswerType: ComponentType<
  ComponentProps<"section"> & IMissionFormChooseAnswerType
> = ({ register, isLoading, mission, ...rest }) => {
  return (
    <section className="form-control w-full" {...rest}>
      <label className="label">
        <span className="label-text">Mission Type</span>
      </label>
      <select
        {...register("answer_type")}
        className="select select-bordered w-full capitalize"
        disabled={isLoading}
      >
        {Object.entries(AnswerTypes)
          .filter(([_, value]) => typeof value === "number")
          .map(([type, value]) => (
            <option key={type} value={value}>
              {normalizeConstantCase(type)}
            </option>
          ))}
      </select>
    </section>
  );
};

export default MissionFormChooseAnswerType;
