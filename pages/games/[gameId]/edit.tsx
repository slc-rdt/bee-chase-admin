import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameForm from "../../../components/game/game-form";
import UpdateGameDto from "../../../libs/dtos/update-game-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Game from "../../../libs/models/game";
import GameService from "../../../libs/services/game-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import getServerSidePropsWrapper from "../../../libs/utils/get-server-side-props-wrapper";

export const getServerSideProps: GetServerSideProps<
  { game: Game },
  { gameId: string }
> = async (context) => {
  return await getServerSidePropsWrapper(
    async () => {
      const gameService = await createServerSideService(
        context.req,
        GameService
      );
      const game = await gameService.getOneById(context.params?.gameId ?? "");
      return { props: { game } };
    },
    {
      destination: `/games`,
      permanent: false,
    }
  );
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
    <div className="mx-auto max-w-screen-md">
      <h2 className="mb-2 text-3xl font-bold">Details</h2>
      <GameForm
        game={game}
        isLoading={isLoading}
        onGameFormSubmit={onGameFormSubmit}
      />
    </div>
  );
};

export default GameDetailEditPage;
