import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AutomationTimeType, AutomationType } from "../../libs/enums";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Automation from "../../libs/models/automation";
import Mission from "../../libs/models/mission";
import AutomationService from "../../libs/services/automation-service";
import convertTimeLocalToServer from "../../libs/utils/convert-time-local-to-server";
import convertTimeServerToLocal from "../../libs/utils/convert-time-server-to-local";
import normalizeConstantCase from "../../libs/utils/normalize-constant-case";
import AutomationFormTypeNotifyUsers from "./automation-form-type-notify-users";
import AutomationFormTypeWithMissions from "./automation-form-type-with-missions";

export interface AutomationFormValues extends Automation {
  radio_when_type: "relative" | "exact";
}

interface IAutomationForm {
  automation?: Automation;
  missions: Mission[];
  onAutomationFormSubmit: (data: Automation) => Promise<void>;
}

const AutomationForm: ComponentType<
  ComponentProps<"div"> & IAutomationForm
> = ({ automation, missions, onAutomationFormSubmit, ...rest }) => {
  const { register, handleSubmit, watch, setValue } =
    useForm<AutomationFormValues>({
      defaultValues: {
        ...(automation ?? {}),
        radio_when_type: "relative",
        when_type: AutomationTimeType.AFTER_GAME_STARTS,
        when_happened: convertTimeServerToLocal(
          automation?.when_happened ?? ""
        ),
      },
    });

  const { isLoading, doAction } = useLoading();

  const onSubmit = handleSubmit(async (data) => {
    let payload = { ...data };

    if (payload.radio_when_type === "exact" && payload.when_happened) {
      const { relative_time, ...rest } = payload;
      payload = {
        ...rest,
        when_type: AutomationTimeType.EXACT,
        when_happened: convertTimeLocalToServer(payload.when_happened),
      };
    }

    if (payload.radio_when_type === "relative") {
      const { when_happened, ...rest } = payload;
      payload = {
        ...rest,
      };
    }

    await doAction(onAutomationFormSubmit(payload));
  });

  const automationType = Number(watch("type"));
  const radioAutomationTimeType = watch("radio_when_type");

  return (
    <div className="card shadow-xl" {...rest}>
      <form onSubmit={onSubmit} className="card-body">
        <h2 className="card-title">Create Automation</h2>

        <section className="form-control">
          <label className="label">
            <span className="label-text">Automation name</span>
          </label>
          <input
            {...register("name")}
            disabled={isLoading}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            required
          />
          <label className="label">
            <span className="label-text-alt">
              Give your automation a descriptive name. This won&apos;t be shared
              with participants!
            </span>
          </label>
        </section>

        <section className="form-control">
          <label className="label">
            <span className="label-text">What do you want to happen?</span>
          </label>
          <select
            {...register("type")}
            disabled={isLoading}
            className="select select-bordered capitalize"
          >
            {Object.entries(AutomationType)
              .filter(([_, v]) => typeof v === "number")
              .map(([type, value]) => (
                <option key={value} value={value}>
                  {normalizeConstantCase(type)}
                </option>
              ))}
          </select>
          <label className="label">
            <span className="label-text-alt">
              Select what you want to happen when this automation is run.
            </span>
          </label>
        </section>

        <section>
          <label className="label">
            <span className="label-text">
              When would you like this automation to happen?
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <input
                  {...register("radio_when_type")}
                  disabled={isLoading}
                  type="radio"
                  className="radio radio-primary"
                  value="relative"
                />
                <span className="label-text">Relative Time</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <input
                  {...register("radio_when_type")}
                  disabled={isLoading}
                  type="radio"
                  className="radio radio-primary"
                  value="exact"
                />
                <span className="label-text">Exact Time</span>
              </label>
            </div>
          </div>
          <label className="label">
            <span className="label-text-alt">
              Select between a relative or exact time.
            </span>
          </label>
        </section>

        {radioAutomationTimeType === "relative" && (
          <section className="flex flex-wrap gap-2">
            <label className="input-group max-w-min">
              <input
                {...register("relative_time")}
                disabled={isLoading}
                type="number"
                className="input input-bordered"
                required
              />
              <span>Minutes</span>
            </label>

            <select
              {...register("when_type")}
              disabled={isLoading}
              className="select select-bordered capitalize"
            >
              {Object.entries(AutomationTimeType)
                .filter(([_, v]) => typeof v === "number")
                .filter(([_, v]) => v !== AutomationTimeType.EXACT)
                .map(([type, value]) => (
                  <option key={value} value={value}>
                    {normalizeConstantCase(type)}
                  </option>
                ))}
            </select>
          </section>
        )}

        {radioAutomationTimeType === "exact" && (
          <input
            {...register("when_happened")}
            disabled={isLoading}
            type="datetime-local"
            className="input input-bordered"
            required
          />
        )}

        {automationType === AutomationType.NOTIFY_ALL_USERS ? (
          <AutomationFormTypeNotifyUsers {...{ register, isLoading }} />
        ) : (
          <AutomationFormTypeWithMissions
            {...{ missions, register, isLoading, watch, setValue }}
          />
        )}

        <section className="card-actions mt-4 justify-end">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </section>
      </form>
    </div>
  );
};

export default AutomationForm;
