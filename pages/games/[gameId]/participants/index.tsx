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
import GameTeamCard from "../../../../components/participants/game-team-card";
import LoginDto from "../../../../libs/dtos/login-dto";
import useService from "../../../../libs/hooks/use-service";
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

  const user = session.user as LoginDto;
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
            Participants can join this Experience by downloading the Goosechase
            app and searching by join code:{" "}
            <span className="font-bold">{game.password}</span>.
          </p>
        </div>
      </section>

      <section className="flex justify-end">
        <Link href={`/games/${gameId}/participants/create-team`}>
          <button className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Create Team
          </button>
        </Link>
      </section>
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
