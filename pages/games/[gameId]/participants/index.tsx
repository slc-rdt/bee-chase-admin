import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import GameParticipantsAllowUserCreateTeamForm from "../../../../components/participants/game-participants-allow-user-create-team-form";
import GameParticipantsTeamOrSoloModeForm from "../../../../components/participants/game-participants-team-or-solo-mode-form";
import GameTeamCard from "../../../../components/participants/game-team-card";
import Game from "../../../../libs/models/game";
import GameTeam from "../../../../libs/models/game-team";
import GameService from "../../../../libs/services/game-service";
import GameTeamService from "../../../../libs/services/game-team-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  { game: Game; gameTeams: GameTeam[] },
  { gameId: string }
> = async (context) => {
  const [gameService, gameTeamService] = await Promise.all([
    createServerSideService(context.req, GameService),
    createServerSideService(context.req, GameTeamService),
  ]);

  const gameId = context.params?.gameId ?? "";

  const [game, gameTeams] = await Promise.all([
    gameService.getOneById(gameId),
    gameTeamService.getAll(gameId),
  ]);

  return {
    props: {
      game,
      gameTeams,
    },
  };
};

const ParticipantsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ game, gameTeams }) => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <h2 className="mb-2 text-3xl font-bold">Participants</h2>

      <section className="card my-4 bg-primary-content shadow-xl">
        <div className="card-body">
          <p>
            Participants can join this Game by visiting asdfsadfasdf and
            searching by join code:{" "}
            <span className="font-bold">{game.access_code}</span>.
          </p>
        </div>
      </section>

      <GameParticipantsTeamOrSoloModeForm game={game} />

      <div className="divider" />

      <section className="flex items-center gap-4">
        <h3 className="flex items-center gap-2">
          <span>Pre-create teams (optional)</span>

          <span
            className="tooltip"
            data-tip="If you're a more active organizer that has already split up your
            participants into teams, you may want to pre-create those teams here
            for your participants to join."
          >
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </span>
        </h3>

        <Link href={`/games/${game.id}/participants/create-team`}>
          <button className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Create Team
          </button>
        </Link>
      </section>

      <GameParticipantsAllowUserCreateTeamForm game={game} />

      <section className="grid grid-cols-1 gap-4">
        {gameTeams.length === 0 && (
          <div className="card shadow-xl">
            <div className="card-body">
              <h2 className="font-lg text-center font-medium">No teams yet.</h2>
            </div>
          </div>
        )}

        {gameTeams.map((gameTeam) => (
          <GameTeamCard key={gameTeam.id} gameTeam={gameTeam} />
        ))}
      </section>
    </div>
  );
};

export default ParticipantsPage;
