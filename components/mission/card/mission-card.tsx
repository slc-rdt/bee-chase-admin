import {
  CameraIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  ListBulletIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ComponentProps, ComponentType } from "react";
import { AnswerTypes, AvailabilityTypes } from "../../../libs/enums";
import Mission from "../../../libs/models/mission";
import MissionIcon from "../mission-icon";
import MissionCardCloneAction from "./mission-card-clone-action";
import MissionCardDeleteAction from "./mission-card-delete-action";
import MissionCardEditAction from "./mission-card-edit-action";

interface IMissionCard {
  mission: Mission;

  number?: number;
  onPressUp?: () => void;
  onPressDown?: () => void;

  editable?: boolean;
  deletable?: boolean;
  clonable?: boolean;
  showAvailability?: boolean;

  checked?: boolean;
  onCheck?: (isChecked: boolean) => void;

  isLoading?: boolean;
}

const MissionCard: ComponentType<ComponentProps<"div"> & IMissionCard> = ({
  mission,
  number,
  onPressUp,
  onPressDown,
  editable,
  deletable,
  clonable,
  showAvailability,
  checked,
  onCheck,
  isLoading,
  ...rest
}) => {
  return (
    <div className="card card-side w-full bg-base-100 shadow-xl" {...rest}>
      {(checked || onCheck) && (
        <section className="ml-8 grid place-items-center">
          <input
            onChange={(e) => onCheck && onCheck(e.target.checked)}
            disabled={isLoading}
            type="checkbox"
            className="checkbox checkbox-primary"
            defaultChecked={checked}
          />
        </section>
      )}

      {typeof number !== "undefined" && (
        <section className="ml-8 flex flex-col items-center justify-center gap-2">
          {onPressUp && (
            <button
              type="button"
              onClick={onPressUp}
              disabled={isLoading}
              className={`btn btn-square btn-ghost ${isLoading && "loading"}`}
            >
              {!isLoading && <ChevronUpIcon />}
            </button>
          )}
          <p className="text-xl font-bold">#{number}</p>
          {onPressDown && (
            <button
              type="button"
              onClick={onPressDown}
              disabled={isLoading}
              className={`btn btn-square btn-ghost ${isLoading && "loading"}`}
            >
              {!isLoading && <ChevronDownIcon />}
            </button>
          )}
        </section>
      )}

      <div className="card-body">
        <header className="card-title flex flex-wrap items-center justify-between capitalize">
          <h2 className="flex items-center gap-2">
            <MissionIcon mission={mission} />
            <span>{mission.name}</span>
          </h2>

          <small>({mission.point_value}) Points</small>
        </header>

        <p dangerouslySetInnerHTML={{ __html: mission.description }} />

        {showAvailability && (
          <>
            <div className="divider"></div>

            <section className="flex items-center gap-2 capitalize">
              <div
                className={`h-4 w-4 rounded-full ${
                  {
                    0: "bg-success",
                    1: "bg-warning",
                    2: "bg-base-300",
                  }[mission.availability]
                }`}
              />

              <span>
                {AvailabilityTypes[mission.availability].toLowerCase()}
              </span>
            </section>
          </>
        )}

        <section className="card-actions justify-end">
          {editable && <MissionCardEditAction mission={mission} />}
          {deletable && <MissionCardDeleteAction mission={mission} />}
          {clonable && <MissionCardCloneAction mission={mission} />}
        </section>
      </div>
    </div>
  );
};

export default MissionCard;
