import { PencilIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Mission from "../../../libs/models/mission";
import MissionService from "../../../libs/services/mission-service";

interface IMissionCardDeleteAction {
  mission: Mission;
}

const MissionCardDeleteAction: ComponentType<
  ComponentProps<"button"> & IMissionCardDeleteAction
> = ({ mission, ...rest }) => {
  const router = useRouter();
  const missionService = useService(MissionService);
  const { isLoading, doAction } = useLoading();

  const gameId = router.query.gameId as string;

  const onDelete = async (mission: Mission) => {
    await toast.promise(doAction(missionService.delete(gameId, mission)), {
      loading: "Deleting mission...",
      success: "Mission deleted!",
      error: "Failed to delete mission",
    });

    router.push(`/games/${gameId}/missions`);
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => onDelete(mission)}
      className={`btn btn-error gap-2 ${isLoading && "loading"}`}
      {...rest}
    >
      <PencilIcon className="h-5 w-5" /> Delete
    </button>
  );
};

export default MissionCardDeleteAction;
