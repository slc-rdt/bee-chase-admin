import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../../components/layouts/layout";
import GameParticipantsAllowUserCreateTeamForm from "../../../../components/participants/game-participants-allow-user-create-team-form";
import GameParticipantsTeamOrSoloModeForm from "../../../../components/participants/game-participants-team-or-solo-mode-form";
import GameTeamCard from "../../../../components/participants/game-team-card";
import LoginDto from "../../../../libs/dtos/login-dto";
import Game from "../../../../libs/models/game";
import GameTeam from "../../../../libs/models/game-team";
import GameService from "../../../../libs/services/game-service";
import GameTeamService from "../../../../libs/services/game-team-service";
import { authOptions } from "../../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<
  { game: Game; gameTeams: GameTeam[] },
  { gameId: string }
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

  const user = session.user;
  const gameService = new GameService(user.access_token);
  const gameTeamService = new GameTeamService(user.access_token);
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
  const router = useRouter();
  const gameId = router.query.gameId;

  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Participants</h2>

      <section className="card my-4 bg-primary-content shadow-xl">
        <div className="card-body">
          <p>
            Participants can join this Game by visiting asdfsadfasdf and
            searching by join code:{" "}
            <span className="font-bold">{game.password}</span>.
          </p>
        </div>
      </section>

      <GameParticipantsTeamOrSoloModeForm game={game} />

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

        <Link href={`/games/${gameId}/participants/create-team`}>
          <button className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Create Team
          </button>
        </Link>
      </section>

      <GameParticipantsAllowUserCreateTeamForm game={game} />

      <section className="grid grid-cols-1 gap-4">
        {gameTeams.length === 0 && (
          <h2 className="font-lg text-center font-medium">No teams yet.</h2>
        )}

        {gameTeams.map((gameTeam) => (
          <GameTeamCard key={gameTeam.id} gameTeam={gameTeam} />
        ))}
      </section>
    </Layout>
  );
};

export default ParticipantsPage;
