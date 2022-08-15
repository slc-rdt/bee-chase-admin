import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Layout from "../../../../components/layouts/layout";
import GameTeamForm from "../../../../components/participants/game-team-form";
import useLoading from "../../../../libs/hooks/common/use-loading";
import useService from "../../../../libs/hooks/common/use-service";
import GameTeam from "../../../../libs/models/game-team";
import GameTeamService from "../../../../libs/services/game-team-service";

const ParticipantsCreateTeamPage = () => {
  const router = useRouter();
  const teamService = useService(GameTeamService);
  const { isLoading, doAction } = useLoading();

  const onSubmit = async (data: GameTeam) => {
    const game_id = router.query.gameId?.toString() ?? "";

    await toast.promise(doAction(teamService.create({ ...data, game_id })), {
      loading: "Creating team...",
      success: "Team created!",
      error: "Failed to created team.",
    });

    router.push(`/games/${game_id}/participants`);
  };

  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Create Team</h2>
      <GameTeamForm isLoading={isLoading} onGameTeamFormSubmit={onSubmit} />
    </>
  );
};

export default ParticipantsCreateTeamPage;
