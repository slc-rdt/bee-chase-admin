import { ComponentProps, ComponentType } from "react";
import { UseFormRegisterReturn, UseFormWatch } from "react-hook-form";
import { MissionFormValues } from "./mission-form";

interface IMissionFormTextType {
  registerFn: () => UseFormRegisterReturn<"mission_data.accepted_answers">;
  watch: UseFormWatch<MissionFormValues>;
  isLoading: boolean;
  defaultValue?: string[];
}

const MissionFormTextType: ComponentType<
  ComponentProps<"section"> & IMissionFormTextType
> = ({ registerFn, watch, isLoading, defaultValue, ...rest }) => {
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
        {...registerFn()}
        disabled={isLoading}
        className="textarea textarea-bordered h-24"
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
