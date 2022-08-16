import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameTeamForm from "../../../../../components/participants/game-team-form";
import { redirectToLogin } from "../../../../../libs/constants";
import useLoading from "../../../../../libs/hooks/common/use-loading";
import useService from "../../../../../libs/hooks/common/use-service";
import GameTeam from "../../../../../libs/models/game-team";
import GameTeamService from "../../../../../libs/services/game-team-service";

export const getServerSideProps: GetServerSideProps<
  { gameTeam: GameTeam },
  { gameId: string; gameTeamId: string }
> = async (context) => {
  const token = await getToken({ req: context.req });

  if (!token?.user) {
    return redirectToLogin;
  }

  const user = token.user;
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
    const game_id = router.query.gameId?.toString() ?? "";

    await toast.promise(doAction(teamService.update(data)), {
      loading: "Updating team...",
      success: "Team updated!",
      error: "Failed to update team.",
    });

    router.push(`/games/${game_id}/participants`);
  };

  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Edit Team</h2>
      <GameTeamForm
        gameTeam={gameTeam}
        isLoading={isLoading}
        onGameTeamFormSubmit={onSubmit}
      />
    </>
  );
};

export default ParticipantsTeamEditPage;
