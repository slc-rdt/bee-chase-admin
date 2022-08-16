import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getToken } from "next-auth/jwt";
import StartEndForm from "../../../components/start-end/start-end-form";
import { redirectToLogin } from "../../../libs/constants";
import Game from "../../../libs/models/game";
import GameService from "../../../libs/services/game-service";

export const getServerSideProps: GetServerSideProps<
  { game: Game },
  { gameId: string }
> = async (context) => {
  const token = await getToken({ req: context.req });

  if (!token?.user) {
    return redirectToLogin;
  }

  const user = token.user;
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
    <>
      <h2 className="mb-2 text-3xl font-bold">Start & End</h2>
      <StartEndForm game={game} />
    </>
  );
};

export default GameDetailStartStopPage;
