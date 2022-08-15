import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import Layout from "../../../components/layouts/layout";
import StartEndForm from "../../../components/start-end/start-end-form";
import LoginDto from "../../../libs/dtos/login-dto";
import Game from "../../../libs/models/game";
import GameService from "../../../libs/services/game-service";
import { authOptions } from "../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<
  { game: Game },
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
  const gameId = context.params?.gameId ?? "";
  const game = await gameService.getOneById(gameId);

  return {
    props: {
      game,
    },
  };
};

const GameDetailStartStopPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ game }) => {
  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Start & End</h2>
      <StartEndForm game={game} />
    </Layout>
  );
};

export default GameDetailStartStopPage;
