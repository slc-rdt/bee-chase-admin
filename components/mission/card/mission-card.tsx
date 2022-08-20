import { ComponentProps, ComponentType } from "react";
import { AvailabilityTypes } from "../../../libs/enums";
import Mission from "../../../libs/models/mission";
import MissionCardCloneAction from "./mission-card-clone-action";
import MissionCardDeleteAction from "./mission-card-delete-action";
import MissionCardEditAction from "./mission-card-edit-action";

interface IMissionCard {
  mission: Mission;
  editable?: boolean;
  deletable?: boolean;
  clonable?: boolean;
  showAvailability?: boolean;
}

const MissionCard: ComponentType<ComponentProps<"div"> & IMissionCard> = ({
  mission,
  editable,
  deletable,
  clonable,
  showAvailability,
  ...rest
}) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl" {...rest}>
      <div className="card-body">
        <h2 className="card-title flex flex-wrap items-center justify-between capitalize">
          <span>{mission.name}</span>
          <small>({mission.point_value}) Points</small>
        </h2>

        <p>{mission.description}</p>

        {showAvailability && (
          <>
            <div className="divider"></div>

            <section className="flex items-center gap-2 capitalize">
              <div
                className={`h-4 w-4 rounded-full ${
                  {
                    0: "bg-green-500",
                    1: "bg-yellow-500",
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
