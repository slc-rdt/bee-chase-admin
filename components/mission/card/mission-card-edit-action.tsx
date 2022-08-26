import { PencilIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import Mission from "../../../libs/models/mission";

interface IMissionCardEditAction {
  mission: Mission;
}

const MissionCardEditAction: ComponentType<
  ComponentProps<"button"> & IMissionCardEditAction
> = ({ mission, ...rest }) => {
  const router = useRouter();

  const gameId = router.query.gameId;

  const onEdit = (mission: Mission) => {
    router.push(`/games/${gameId}/missions/${mission.id}/edit`);
  };

  return (
    <button
      onClick={() => onEdit(mission)}
      className="btn btn-secondary gap-2"
      {...rest}
    >
      <PencilIcon className="h-5 w-5" /> Edit
    </button>
  );
};

export default MissionCardEditAction;
