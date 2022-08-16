import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameForm from "../../../components/game/game-form";
import { redirectToLogin } from "../../../libs/constants";
import UpdateGameDto from "../../../libs/dtos/update-game-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
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
  const game = await gameService.getOneById(context.params?.gameId ?? "");

  if (!game) {
    return {
      props: {},
      redirect: {
        destination: "/games",
        permanent: false,
      },
    };
  }

  return {
    props: {
      game,
    },
  };
};

const GameDetailEditPage = ({
  game,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const gameService = useService(GameService);
  const { isLoading, doAction } = useLoading();

  const onGameFormSubmit = async (data: UpdateGameDto) => {
    await toast.promise(doAction(gameService.update({ ...game, ...data })), {
      loading: "Updating game...",
      success: "Game saved!",
      error: "Failed to save game.",
    });
    router.push(router.asPath);
  };

  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Details</h2>
      <GameForm
        game={game}
        isLoading={isLoading}
        onGameFormSubmit={onGameFormSubmit}
      />
    </>
  );
};

export default GameDetailEditPage;
