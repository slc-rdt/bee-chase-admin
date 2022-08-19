import { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import CreateMissionDto from "../../../libs/dtos/create-mission-dto";
import UpdateMissionDto from "../../../libs/dtos/update-mission-dto";
import { AnswerTypes } from "../../../libs/enums";
import Mission from "../../../libs/models/mission";
import MissionData from "../../../libs/models/mission-data";
import MissionFormChooseAnswerType from "./mission-form-choose-answer-type";
import MissionFormChooseAvailability from "./mission-form-choose-availability";
import MissionFormGpsType from "./mission-form-gps-type";
import MissionFormImageType from "./mission-form-image-type";
import MissionFormTextType from "./mission-form-text-type";

export type MissionFormValues = CreateMissionDto | UpdateMissionDto;

interface IMissionForm {
  mission?: Mission;
  isLoading: boolean;
  onMissionFormSubmit: (data: MissionFormValues) => void;
}

const MissionForm: ComponentType<ComponentProps<"div"> & IMissionForm> = ({
  mission,
  isLoading,
  onMissionFormSubmit,
  ...rest
}) => {
  const missionData: MissionData = mission?.mission_data
    ? JSON.parse(mission.mission_data)
    : {};
  // navigator.geolocation.getCurrentPosition(successCallback)
  const { register, handleSubmit, watch, setValue } =
    useForm<MissionFormValues>({
      defaultValues: {
        ...(mission ?? {}),

        answer_type: mission?.answer_type ?? AnswerTypes.IMAGE,

        mission_data: {
          ...missionData,

          accepted_answers: Array.isArray(missionData.accepted_answers)
            ? missionData.accepted_answers.join("\n")
            : missionData.accepted_answers,

          radius: missionData.radius ?? 100,
        },

        shown_in_feed:
          typeof mission?.shown_in_feed === "undefined"
            ? true
            : mission.shown_in_feed,
      },
    });

  const answerType = Number(watch("answer_type"));
  const isShowInFeed = Boolean(watch("shown_in_feed"));

  const onSubmit = handleSubmit((data) => {
    const acceptedAnswers = data.mission_data.accepted_answers;
    if (typeof acceptedAnswers === "string") {
      data.mission_data.accepted_answers = acceptedAnswers.split("\n");
    }

    onMissionFormSubmit(data);
  });

  return (
    <div className="card shadow-xl" {...rest}>
      <form onSubmit={onSubmit} className="card-body">
        <h2 className="card-title">{mission ? "Edit" : "Create"} Mission</h2>

        <MissionFormChooseAnswerType {...{ register, isLoading, mission }} />

        <div className="divider" />

        <div className="grid grid-cols-12 gap-4">
          <section className="form-control col-span-12 w-full sm:col-span-9 md:col-span-10">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              {...register("name")}
              type="text"
              disabled={isLoading}
              className="input input-bordered w-full"
              required
            />
          </section>

          <section className="form-control col-span-12 w-full sm:col-span-3 md:col-span-2">
            <label className="label">
              <span className="label-text">Points</span>
            </label>
            <input
              {...register("point_value")}
              type="number"
              disabled={isLoading}
              className="input input-bordered w-full"
              required
            />
          </section>
        </div>

        <section className="form-control w-full">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            {...register("description")}
            disabled={isLoading}
            className="textarea textarea-bordered h-32"
            required
          ></textarea>
        </section>

        <section className="form-control w-full">
          <label className="label">
            <span className="label-text">Attached Photo Link (Optional)</span>
          </label>
          <input
            {...register("attached_image_link")}
            type="url"
            disabled={isLoading}
            className="input input-bordered w-full"
          />
        </section>

        <section className="form-control w-full">
          <label className="label">
            <span className="label-text">Attached Link (Optional)</span>
          </label>
          <input
            {...register("attached_link")}
            type="url"
            disabled={isLoading}
            className="input input-bordered w-full"
          />
        </section>

        <div className="divider" />

        {answerType === AnswerTypes.IMAGE && (
          <MissionFormImageType {...{ register, isLoading }} />
        )}

        {answerType === AnswerTypes.TEXT && (
          <MissionFormTextType {...{ register, watch, isLoading }} />
        )}

        {answerType === AnswerTypes.GPS && (
          <MissionFormGpsType {...{ register, watch, setValue, isLoading }} />
        )}

        <div className="divider" />

        <MissionFormChooseAvailability
          {...{ register, watch, isLoading, mission }}
        />

        <div className="divider" />

        <section className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              {...register("shown_in_feed")}
              type="checkbox"
              className="checkbox checkbox-primary"
              disabled={isLoading}
              defaultChecked
            />
            <span className="label-text">Show in feed</span>
          </label>
          <label className="label">
            <span className="label-text">
              Participants {isShowInFeed ? "can" : "can't"} see each
              other&apos;s submissions.
            </span>
          </label>
        </section>

        <section className="card-actions justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary ${isLoading && "loading"}`}
          >
            Save
          </button>
        </section>
      </form>
    </div>
  );
};

export default MissionForm;
