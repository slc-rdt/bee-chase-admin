import { DateTime, Duration } from "luxon";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import { LuxonFormatForInputDateTimeLocal } from "../../libs/constants";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
import convertTimeLocalToServer from "../../libs/utils/convert-time-local-to-server";
import convertTimeServerToLocal from "../../libs/utils/convert-time-server-to-local";
import StartEndManualType from "./start-end-manual-type";
import StartEndScheduleType from "./start-end-schedule-type";

export interface StartEndFormValues {
  scheduleType: "manual" | "schedule";
  start_time: Date | string | null;
  end_time: Date | string | null;
  duration_value: number;
  duration_type: "minutes" | "hours" | "days";
}

interface IStartEndForm {
  game: Game;
}

const StartEndForm: ComponentType<
  ComponentProps<"section"> & IStartEndForm
> = ({ game, ...rest }) => {
  const router = useRouter();
  const gameService = useService(GameService);
  const { mutate } = useSWRConfig();
  const { isLoading, doAction } = useLoading();

  const isGameStarted = game.start_time || game.end_time;

  const { register, handleSubmit, watch, setValue } =
    useForm<StartEndFormValues>({
      defaultValues: {
        scheduleType: isGameStarted ? "schedule" : "manual",
        start_time: convertTimeServerToLocal(game.start_time ?? ""),
        end_time: convertTimeServerToLocal(game.end_time ?? ""),
      },
    });

  const onSubmit = handleSubmit(async ({ scheduleType, ...data }) => {
    let payload = { ...game };

    if (scheduleType === "manual") {
      const { duration_type, duration_value } = data;

      const startTime = DateTime.utc();
      const duration = Duration.fromObject({
        [duration_type]: duration_value,
      });

      const endTime = startTime.plus(duration);

      payload = {
        ...payload,
        // MySQL DateTime only accepts 'YYYY-MM-DDTHH:MM' format, excluding the seconds and 'Z'
        start_time: startTime.toUTC().toSQL(),
        end_time: endTime.toUTC().toSQL(),
      };
    }

    if (scheduleType === "schedule") {
      const { start_time, end_time } = data;
      payload = {
        ...payload,
        start_time: convertTimeLocalToServer(start_time ?? ""),
        end_time: convertTimeLocalToServer(end_time ?? ""),
      };
    }

    await toast.promise(doAction(gameService.update(payload)), {
      loading: "Upading game start and end time...",
      success: "Update success!",
      error: "Failed to update game start and end time.",
    });

    setValue(
      "start_time",
      DateTime.fromSQL(payload.start_time?.toString() ?? "").toFormat(
        LuxonFormatForInputDateTimeLocal
      )
    );

    setValue(
      "end_time",
      DateTime.fromSQL(payload.end_time?.toString() ?? "").toFormat(
        LuxonFormatForInputDateTimeLocal
      )
    );

    setValue("scheduleType", "schedule");

    mutate(`/games/${game.id}`);
    router.push(router.asPath);
  });

  const onStop = async () => {
    const payload = {
      ...game,
      start_time: null,
      end_time: null,
    };

    await toast.promise(doAction(gameService.update(payload)), {
      loading: "Stopping game...",
      success: "Game stopped!",
      error: "Failed to stop game.",
    });

    mutate(`/games/${game.id}`);
    router.push(router.asPath);
  };

  const scheduleType = watch("scheduleType");

  return (
    <section className="card shadow-xl" {...rest}>
      <form onSubmit={onSubmit} className="card-body">
        <section>
          <label className="label">
            <span className="label-text">
              When does your experience go live?
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <input
                  {...register("scheduleType")}
                  type="radio"
                  className="radio radio-primary"
                  value="manual"
                  disabled={!!isGameStarted}
                />
                <span className="label-text">Manual</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <input
                  {...register("scheduleType")}
                  type="radio"
                  className="radio radio-primary"
                  value="schedule"
                />
                <span className="label-text">Schedule</span>
              </label>
            </div>
          </div>
        </section>

        {scheduleType === "manual" && (
          <StartEndManualType register={register} isLoading={isLoading} />
        )}
        {scheduleType === "schedule" && (
          <StartEndScheduleType register={register} isLoading={isLoading} />
        )}

        <div className="card-actions mt-2 justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary ${isLoading && "loading"}`}
          >
            {isGameStarted ? "Update Game Time" : "Start Game"}
          </button>

          <button
            onClick={onStop}
            type="button"
            disabled={isLoading || !isGameStarted}
            className={`btn btn-error ${isLoading && "loading"}`}
          >
            Stop Game
          </button>
        </div>
      </form>
    </section>
  );
};

export default StartEndForm;
