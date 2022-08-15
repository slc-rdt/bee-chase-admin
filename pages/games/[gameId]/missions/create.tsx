import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Layout from "../../../../components/layouts/layout";
import MissionForm from "../../../../components/mission/mission-form";
import CreateMissionDto from "../../../../libs/dtos/create-mission-dto";
import useLoading from "../../../../libs/hooks/common/use-loading";
import useService from "../../../../libs/hooks/common/use-service";
import MissionService from "../../../../libs/services/mission-service";

const MissionCreatePage = () => {
  const { isLoading, doAction } = useLoading();
  const missionService = useService(MissionService);
  const router = useRouter();

  const onSubmit = async (data: CreateMissionDto) => {
    const gameId = router.query.gameId as string;

    data.mission_data ??= {};

    await toast.promise(doAction(missionService.create(gameId, { ...data })), {
      loading: "Creating mission...",
      success: "Mission created!",
      error: "Failed to create mission.",
    });

    router.push(`/games/${gameId}/missions`);
  };

  return (
    <>
      <MissionForm isLoading={isLoading} onMissionFormSubmit={onSubmit} />
    </>
  );
};

export default MissionCreatePage;
