import { TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Mission from "../../../libs/models/mission";
import MissionService from "../../../libs/services/mission-service";
import ConfirmationModal from "../../common/confirmation-modal";

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
    <ConfirmationModal
      className="btn btn-error gap-2"
      modalKey={mission.id}
      isLoading={isLoading}
      onConfirm={() => onDelete(mission)}
    >
      <TrashIcon className="h-5 w-5" />
      Delete
    </ConfirmationModal>
  );
};

export default MissionCardDeleteAction;
