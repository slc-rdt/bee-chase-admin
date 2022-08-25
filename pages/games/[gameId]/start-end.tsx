import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import StartEndForm from "../../../components/start-end/start-end-form";
import Game from "../../../libs/models/game";
import GameService from "../../../libs/services/game-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  { game: Game },
  { gameId: string }
> = async (context) => {
  try {
    const gameService = await createServerSideService(context.req, GameService);
    const gameId = context.params?.gameId ?? "";
    const game = await gameService.getOneById(gameId);
    return { props: { game } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const GameDetailStartStopPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ game }) => {
  return (
    <div className="mx-auto max-w-screen-md">
      <h2 className="mb-2 text-3xl font-bold">Start & End</h2>
      <StartEndForm game={game} />
    </div>
  );
};

export default GameDetailStartStopPage;
