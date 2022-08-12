import { DateTime, Duration } from "luxon";
import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/use-loading";
import useService from "../../libs/hooks/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
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
  const { isLoading, doAction } = useLoading();

  const isGameStarted = game.start_time || game.end_time;

  const { register, handleSubmit, watch } = useForm<StartEndFormValues>({
    defaultValues: {
      scheduleType: isGameStarted ? "schedule" : "manual",
      start_time: game.start_time,
      end_time: game.end_time,
    },
  });

  const onSubmit = handleSubmit(async ({ scheduleType, ...data }) => {
    let payload = { ...game };

    if (scheduleType === "manual") {
      const { duration_type, duration_value } = data;

      const startTime = DateTime.now();
      const duration = Duration.fromObject({
        [duration_type]: duration_value,
      });

      const endTime = startTime.plus(duration);

      payload = {
        ...payload,
        // MySQL DateTime only accepts 'YYYY-MM-DDTHH:MM' format, excluding the seconds and 'Z'
        start_time: startTime.toISO().substring(0, "YYYY-MM-DDTHH:MM".length),
        end_time: endTime.toISO().substring(0, "YYYY-MM-DDTHH:MM".length),
      };
    }

    if (scheduleType === "schedule") {
      const { start_time, end_time } = data;
      payload = {
        ...payload,
        start_time,
        end_time,
      };
    }

    await toast.promise(
      doAction(async () => await gameService.update(payload)),
      {
        loading: "Upading game start and end time...",
        success: "Update success!",
        error: "Failed to update game start and end time.",
      }
    );

    router.push(router.asPath);
  });

  const onStop = async () => {
    const payload = {
      ...game,
      start_time: null,
      end_time: null,
    };

    await toast.promise(
      doAction(async () => await gameService.update(payload)),
      {
        loading: "Stopping game...",
        success: "Game stopped!",
        error: "Failed to stop game.",
      }
    );

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
