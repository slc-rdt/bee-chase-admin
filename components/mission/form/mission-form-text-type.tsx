import { ComponentProps, ComponentType } from "react";
import {
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormWatch,
} from "react-hook-form";
import { MissionFormValues } from "./mission-form";

interface IMissionFormTextType {
  register: UseFormRegister<MissionFormValues>;
  watch: UseFormWatch<MissionFormValues>;
  isLoading: boolean;
  defaultValue?: string[];
}

const MissionFormTextType: ComponentType<
  ComponentProps<"section"> & IMissionFormTextType
> = ({ register, watch, isLoading, defaultValue, ...rest }) => {
  const originalAcceptedAnswers = watch("mission_data.accepted_answers") ?? "";

  const acceptedAnswers =
    typeof originalAcceptedAnswers === "string"
      ? originalAcceptedAnswers
          .split("\n")
          .map((x) => x.trim())
          .filter((x) => !!x)
      : originalAcceptedAnswers;

  return (
    <section className="form-control w-full" {...rest}>
      <label className="label">
        <span className="label-text">Accepted Answers (Optional)</span>
      </label>

      <textarea
        {...register("mission_data.accepted_answers")}
        disabled={isLoading}
        className="textarea textarea-bordered h-32"
      ></textarea>

      <label className="label">
        <div className="label-text-alt flex flex-wrap gap-1">
          {acceptedAnswers.map((answer) => (
            <div key={answer} className="badge badge-primary">
              {answer}
            </div>
          ))}
        </div>
      </label>
    </section>
  );
};

export default MissionFormTextType;
