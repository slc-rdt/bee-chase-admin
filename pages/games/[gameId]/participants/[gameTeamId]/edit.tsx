import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../../../components/layouts/layout";
import GameTeamForm from "../../../../../components/participants/game-team-form";
import LoginDto from "../../../../../libs/dtos/login-dto";
import useLoading from "../../../../../libs/hooks/use-loading";
import useService from "../../../../../libs/hooks/use-service";
import GameTeam from "../../../../../libs/models/game-team";
import GameTeamService from "../../../../../libs/services/game-team-service";
import { authOptions } from "../../../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<
  { gameTeam: GameTeam },
  { gameId: string; gameTeamId: string }
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
  const gameTeamService = new GameTeamService(user.access_token);
  const gameId = context.params?.gameId ?? "";
  const gameTeamId = context.params?.gameTeamId ?? "";
  const gameTeam = await gameTeamService.getOneById(gameId, gameTeamId);

  return {
    props: {
      gameTeam,
    },
  };
};

const ParticipantsTeamEditPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameTeam }) => {
  const router = useRouter();
  const teamService = useService(GameTeamService);
  const { isLoading, doAction } = useLoading();

  const onSubmit = async (data: GameTeam) => {
    console.log(data);
  };

  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Edit Team</h2>
      <GameTeamForm
        gameTeam={gameTeam}
        isLoading={isLoading}
        onGameTeamFormSubmit={onSubmit}
      />
    </Layout>
  );
};

export default ParticipantsTeamEditPage;
