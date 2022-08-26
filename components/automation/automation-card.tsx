import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AutomationTimeType, AutomationType } from "../../libs/enums";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Automation from "../../libs/models/automation";
import AutomationData from "../../libs/models/automation-data";
import AutomationService from "../../libs/services/automation-service";
import normalizeConstantCase from "../../libs/utils/normalize-constant-case";
import parseJsonIfString from "../../libs/utils/parse-json-if-string";
import MissionCard from "../mission/card/mission-card";

interface IAutomationCard {
  automation: Automation;
}

const AutomationCard: ComponentType<
  ComponentProps<"div"> & IAutomationCard
> = ({ automation, ...rest }) => {
  const router = useRouter();
  const automationService = useService(AutomationService);
  const { isLoading, doAction } = useLoading();
  const [when, setWhen] = useState("");

  const gameId = router.query.gameId;
  const automationData = parseJsonIfString<AutomationData>(automation.automation_data);

  const onDelete = async () => {
    await toast.promise(doAction(automationService.delete(automation)), {
      loading: "Deleting automation...",
      success: "Automation deleted!",
      error: "Failed to delete automation",
    });

    router.push(router.asPath);
  };

  useEffect(() => {
    if (automation.when_happened) {
      setWhen(
        DateTime.fromISO(automation.when_happened?.toString() ?? "")
          .toLocal()
          .toLocaleString(DateTime.DATETIME_HUGE)
      );
    }
  }, [automation.when_happened]);

  return (
    <div className="card shadow-xl" {...rest}>
      <div className="card-body">
        <h2 className="card-title">{automation.name}</h2>

        <section>
          <span className="font-bold">Action: </span>
          <span className="capitalize">
            {normalizeConstantCase(AutomationType[automation.type])}
          </span>
        </section>

        <section>
          <span className="font-bold">When: </span>
          {automation.when_type === AutomationTimeType.EXACT ? (
            <span>{when}</span>
          ) : (
            <span>
              {automation.when_type === AutomationTimeType.AFTER_GAME_STARTS &&
                `${automation.relative_time} min after Game starts.`}

              {automation.when_type === AutomationTimeType.BEFORE_GAME_ENDS &&
                `${automation.relative_time} min before Game ends.`}
            </span>
          )}
        </section>

        {automation.type === AutomationType.NOTIFY_ALL_USERS && (
          <section>
            <span className="font-bold">Message: </span>
            {automationData.message}
          </section>
        )}

        {[
          AutomationType.SET_MISSION_AVAILABLE,
          AutomationType.SET_MISSION_EXPIRED,
          AutomationType.SET_MISSION_HIDDEN,
        ].includes(automation.type) && (
          <section>
            <p className="mb-4 font-bold">Mission: </p>
            <div className="grid max-h-96 grid-cols-1 gap-4 overflow-auto rounded-xl p-4 shadow">
              {automation.missions?.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  showAvailability
                />
              ))}
            </div>
          </section>
        )}

        <section className="card-actions justify-end">
          <Link href={`/games/${gameId}/automations/${automation.id}/edit`}>
            <a className="btn btn-secondary gap-2">
              <PencilIcon className="h-5 w-5" /> Edit
            </a>
          </Link>

          <button
            disabled={isLoading}
            onClick={onDelete}
            className={`btn btn-error gap-2 ${isLoading && "loading"}`}
          >
            {!isLoading && <TrashIcon className="h-5 w-5" />} Delete
          </button>
        </section>
      </div>
    </div>
  );
};

export default AutomationCard;
