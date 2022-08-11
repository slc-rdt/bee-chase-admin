import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Layout from "../../../../components/layouts/layout";
import CreateMissionDto from "../../../../libs/dtos/create-mission-dto";
import useLoading from "../../../../libs/hooks/use-loading";
import useService from "../../../../libs/hooks/use-service";
import MissionService from "../../../../libs/services/mission-service";

const missionTypes = ["image", "text", "gps"];
const availabilityTypes = ["available", "hidden", "expired"];

const CreateMissionPage = () => {
  const { register, handleSubmit, watch } = useForm<CreateMissionDto>();
  const { isLoading, doAction } = useLoading();
  const missionService = useService(MissionService);
  const router = useRouter();

  const answerType = Number(watch("answer_type"));
  const isTypeText = answerType === 1;
  const isTypeGps = answerType === 2;

  const availability = Number(watch("availability"));
  const isAvailable = availability === 0;
  const isHidden = availability === 1;
  const isExpired = availability === 2;

  const isShowInFeed = Boolean(watch("shown_in_feed"));

  const acceptedAnswersStr = (watch("mission_data.accepted_answers") ??
    "") as string;
  const acceptedAnswers = acceptedAnswersStr
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => !!x);

  const onSubmit = handleSubmit(async (data) => {
    const gameId = router.query.gameId as string;

    data.mission_data ??= {};

    await toast.promise(
      doAction(async () => await missionService.create(gameId, { ...data })),
      {
        loading: "Creating mission...",
        success: "Mission created!",
        error: "Failed to create mission.",
      }
    );

    router.push(`/games/${gameId}/missions`);
  });

  return (
    <Layout>
      <div className="card shadow-xl">
        <form onSubmit={onSubmit} className="card-body">
          <h2 className="card-title">Create Mission</h2>

          <section className="form-control w-full">
            <label className="label">
              <span className="label-text">Mission Type</span>
            </label>
            <select
              {...register("answer_type")}
              className="select select-bordered w-full capitalize"
              disabled={isLoading}
            >
              {missionTypes.map((type, idx) => (
                <option key={type} value={idx}>
                  {type}
                </option>
              ))}
            </select>
          </section>

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
              className="textarea textarea-bordered h-24"
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

          {isTypeText && (
            <section className="form-control w-full">
              <label className="label">
                <span className="label-text">Accepted Answers (Optional)</span>
              </label>
              <textarea
                {...register("mission_data.accepted_answers")}
                disabled={isLoading}
                className="textarea textarea-bordered h-24"
              ></textarea>
              <label className="label">
                <div className="label-text-alt flex flex-wrap gap-1">
                  {acceptedAnswers.map((answer) => (
                    <div className="badge badge-primary">{answer}</div>
                  ))}
                </div>
              </label>
            </section>
          )}

          {isTypeGps && (
            <div className="grid grid-cols-12 gap-4">
              <section className="form-control col-span-12 sm:col-span-6">
                <label className="label">
                  <span className="label-text">Latitude (Optional)</span>
                </label>
                <input
                  {...register("mission_data.latitude")}
                  type="number"
                  disabled={isLoading}
                  className="input input-bordered w-full"
                />
              </section>
              <section className="form-control col-span-12 sm:col-span-6">
                <label className="label">
                  <span className="label-text">Longitude (Optional)</span>
                </label>
                <input
                  {...register("mission_data.longitude")}
                  type="number"
                  disabled={isLoading}
                  className="input input-bordered w-full"
                />
              </section>
            </div>
          )}

          <section className="form-control w-full">
            <label className="label">
              <span className="label-text">Mission Availability</span>
            </label>
            <select
              {...register("availability")}
              className="select select-bordered w-full capitalize"
              disabled={isLoading}
            >
              {availabilityTypes.map((type, idx) => (
                <option key={type} value={idx}>
                  {type}
                </option>
              ))}
            </select>
            <label className="label">
              {isAvailable && (
                <span className="label-text">
                  Participants can see and complete this Mission when the Game
                  is live.
                </span>
              )}
              {isHidden && (
                <span className="label-text">
                  Participants can't see or complete this Mission when the Game
                  is live.
                </span>
              )}
              {isExpired && (
                <span className="label-text">
                  Participants can see but not complete this Mission when the
                  Game is live.
                </span>
              )}
            </label>
          </section>

          <section className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                {...register("shown_in_feed")}
                type="checkbox"
                className="checkbox"
                disabled={isLoading}
                defaultChecked
              />
              <span className="label-text">Show in feed</span>
            </label>
            <label className="label">
              <span className="label-text">
                Participants {isShowInFeed ? "can" : "can't"} see each other's
                submissions.
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
    </Layout>
  );
};

export default CreateMissionPage;
