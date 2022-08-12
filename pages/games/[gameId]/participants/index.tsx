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
import GameTeam from "../../../../libs/models/game-team";
import GameTeamService from "../../../../libs/services/game-team-service";
import { authOptions } from "../../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<
  { gameTeams: GameTeam[] },
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
  const gameTeamService = new GameTeamService(user.access_token);
  const gameId = context.params?.gameId ?? "";
  const gameTeams = await gameTeamService.getAll(gameId);

  return {
    props: {
      gameTeams,
    },
  };
};

const ParticipantsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameTeams }) => {
  const router = useRouter();
  const gameId = router.query.gameId;

  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Participants</h2>

      <Link href={`/games/${gameId}/participants/create-team`}>
        <button className="btn btn-primary">Create Team</button>
      </Link>

      <section className="grid grid-cols-1 gap-4">
        {gameTeams.map((gameTeam) => (
          <GameTeamCard gameTeam={gameTeam} />
        ))}
      </section>
    </Layout>
  );
};

export default ParticipantsPage;
