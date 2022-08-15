import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import Mission from "../../libs/models/mission";

interface IMissionCard {
  mission: Mission;
}

const MissionCard: ComponentType<ComponentProps<"div"> & IMissionCard> = ({
  mission,
  ...rest
}) => {
  const router = useRouter();

  const gameId = router.query.gameId;

  const onEdit = (mission: Mission) => {
    router.push(`/games/${gameId}/missions/${mission.id}/edit`);
  };

  const onDelete = (mission: Mission) => {
    router.push(`/games/${gameId}/missions`);
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl" {...rest}>
      <div className="card-body">
        <h2 className="card-title flex items-center justify-between capitalize">
          <span>{mission.name}</span>
          <small>({mission.point_value}) Points</small>
        </h2>

        <p>{mission.description}</p>

        <div className="card-actions justify-end">
          <button
            onClick={() => onEdit(mission)}
            className="btn btn-secondary gap-2"
          >
            <PencilIcon className="h-5 w-5" /> Edit
          </button>
          <button
            onClick={() => onDelete(mission)}
            className="btn btn-error gap-2"
          >
            <TrashIcon className="h-5 w-5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
