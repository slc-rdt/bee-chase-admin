import { PlusIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import CreateMissionDto from "../../../libs/dtos/create-mission-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Mission from "../../../libs/models/mission";
import MissionData from "../../../libs/models/mission-data";
import MissionService from "../../../libs/services/mission-service";
import parseJsonIfString from "../../../libs/utils/parse-json-if-string";

interface IMissionCardCloneAction {
  mission: Mission;
}

const MissionCardCloneAction: ComponentType<
  ComponentProps<"button"> & IMissionCardCloneAction
> = ({ mission, ...rest }) => {
  const router = useRouter();
  const missionService = useService(MissionService);
  const { isLoading, doAction } = useLoading();

  const gameId = router.query.gameId as string;

  const onClone = async (mission: Mission) => {
    await toast.promise(
      doAction(
        missionService.create(gameId, {
          ...(mission as CreateMissionDto),
          parent_mission_id: mission.id,
          mission_data: parseJsonIfString<MissionData>(mission.mission_data),
        })
      ),
      {
        loading: "Adding mission to game...",
        success: "Mission added to game!",
        error: "Failed to add mission to game",
      }
    );

    router.push(router.asPath);
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => onClone(mission)}
      className={`btn btn-primary gap-2 ${isLoading && "loading"}`}
      {...rest}
    >
      {!isLoading && <PlusIcon className="h-5 w-5" />} Add
    </button>
  );
};

export default MissionCardCloneAction;
