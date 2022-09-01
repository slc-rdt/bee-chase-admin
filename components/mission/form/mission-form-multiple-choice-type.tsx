import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import React, { ComponentProps, ComponentType } from "react";
import {
  Control,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { MissionFormValues } from "./mission-form";

interface IMissionFormMultipleChoiceType {
  control: Control<MissionFormValues>;
  register: UseFormRegister<MissionFormValues>;
  watch: UseFormWatch<MissionFormValues>;
  setValue: UseFormSetValue<MissionFormValues>;
  isLoading: boolean;
}

const MissionFormMultipleChoiceType: ComponentType<
  ComponentProps<"section"> & IMissionFormMultipleChoiceType
> = ({ control, register, watch, setValue, isLoading, ...rest }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "mission_data.choicesProxy" as never,
  });

  const onAddChoice = () => {
    append({ value: '', isCorrect: false });
  };

  return (
    <section {...rest}>
      <div className="form-control gap-2">
        {fields?.map((field, index) => (
          <label
            key={field.id}
            className="label cursor-pointer justify-start gap-2"
          >
            <input
              {...register(`mission_data.choicesProxy.${index}.isCorrect`)}
              type="checkbox"
              className="checkbox checkbox-primary"
            />

            <input
              {...register(`mission_data.choicesProxy.${index}.value`)}
              type="text"
              className="input input-bordered flex-grow"
            />

            <button
              onClick={() => remove(index)}
              type="button"
              className="btn btn-error btn-square"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </label>
        ))}

        <button
          onClick={onAddChoice}
          type="button"
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Choice
        </button>
      </div>

      <div className="form-control mt-4">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            {...register("mission_data.can_choose_multiple")}
            type="checkbox"
            className="checkbox checkbox-primary"
          />
          <span className="label-text">Player can choose multiple?</span>
        </label>
      </div>
    </section>
  );
};

export default MissionFormMultipleChoiceType;
