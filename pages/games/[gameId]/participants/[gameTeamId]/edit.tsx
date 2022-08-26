import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameTeamForm, {
  GameTeamFormValues
} from "../../../../../components/participants/game-team-form";
import useLoading from "../../../../../libs/hooks/common/use-loading";
import useService from "../../../../../libs/hooks/common/use-service";
import GameTeam from "../../../../../libs/models/game-team";
import GameTeamService from "../../../../../libs/services/game-team-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  { gameTeam: GameTeam },
  { gameId: string; gameTeamId: string }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";
    const gameTeamId = context.params?.gameTeamId ?? "";

    const gameTeamService = await createServerSideService(
      context.req,
      GameTeamService
    );

    const gameTeam = await gameTeamService.getOneById(gameId, gameTeamId);

    return { props: { gameTeam } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: `/games`,
      permanent: false,
    });
  }
};

const ParticipantsTeamEditPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameTeam }) => {
  const router = useRouter();
  const teamService = useService(GameTeamService);
  const { isLoading, doAction } = useLoading();

  const onSubmit = async (data: GameTeamFormValues) => {
    const game_id = router.query.gameId?.toString() ?? "";

    await toast.promise(
      doAction(teamService.update({ ...gameTeam, ...data })),
      {
        loading: "Updating team...",
        success: "Team updated!",
        error: "Failed to update team.",
      }
    );

    router.push(`/games/${game_id}/participants`);
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <h2 className="mb-2 text-3xl font-bold">Edit Team</h2>
      <GameTeamForm
        gameTeam={gameTeam}
        isLoading={isLoading}
        onGameTeamFormSubmit={onSubmit}
      />
    </div>
  );
};

export default ParticipantsTeamEditPage;
