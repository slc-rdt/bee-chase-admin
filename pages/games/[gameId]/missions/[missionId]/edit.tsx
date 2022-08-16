import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import MissionForm from "../../../../../components/mission/form/mission-form";
import UpdateMissionDto from "../../../../../libs/dtos/update-mission-dto";
import useLoading from "../../../../../libs/hooks/common/use-loading";
import useService from "../../../../../libs/hooks/common/use-service";
import Mission from "../../../../../libs/models/mission";
import MissionService from "../../../../../libs/services/mission-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  { mission: Mission },
  { gameId: string; missionId: string }
> = async (context) => {
  const missionService = await createServerSideService(
    context.req,
    MissionService
  );
  const gameId = context.params?.gameId ?? "";
  const missionId = context.params?.missionId ?? "";
  const mission = await missionService.getOneById(gameId, missionId);

  return {
    props: {
      mission,
    },
  };
};

const MissionEditPage = ({
  mission,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, doAction } = useLoading();
  const router = useRouter();
  const missionService = useService(MissionService);

  const onSubmit = async (data: UpdateMissionDto) => {
    const gameId = router.query.gameId as string;

    await toast.promise(
      doAction(missionService.update(gameId, { ...mission, ...data })),
      {
        loading: "Updating mission...",
        success: "Mission updated!",
        error: "Failed to update mission",
      }
    );

    router.push(`/games/${gameId}/missions`);
  };

  return (
    <>
      <MissionForm
        mission={mission}
        isLoading={isLoading}
        onMissionFormSubmit={(data) => {
          onSubmit(data as UpdateMissionDto);
        }}
      />
    </>
  );
};

export default MissionEditPage;
