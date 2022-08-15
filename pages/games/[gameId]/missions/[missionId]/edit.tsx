import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import Layout from "../../../../../components/layouts/layout";
import MissionForm from "../../../../../components/mission/mission-form";
import LoginDto from "../../../../../libs/dtos/login-dto";
import UpdateMissionDto from "../../../../../libs/dtos/update-mission-dto";
import useLoading from "../../../../../libs/hooks/use-loading";
import useService from "../../../../../libs/hooks/use-service";
import Mission from "../../../../../libs/models/mission";
import MissionService from "../../../../../libs/services/mission-service";
import { authOptions } from "../../../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<
  { mission: Mission },
  { gameId: string; missionId: string }
> = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session?.user) {
    return {
      props: {},
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const user = session.user as LoginDto;
  const missionService = new MissionService(user.access_token);
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
      doAction(
        async () => await missionService.update(gameId, { ...mission, ...data })
      ),
      {
        loading: "Updating mission...",
        success: "Mission updated!",
        error: "Failed to update mission",
      }
    );

    router.push(`/games/${gameId}/missions`);
  };

  return (
    <Layout>
      <MissionForm
        mission={mission}
        isLoading={isLoading}
        onMissionFormSubmit={data => {
          onSubmit(data as UpdateMissionDto);
        }}
      />
    </Layout>
  );
};

export default MissionEditPage;
