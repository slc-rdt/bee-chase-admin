import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameForm from "../../../components/game/game-form";
import Layout from "../../../components/layouts/layout";
import LoginDto from "../../../libs/dtos/login-dto";
import UpdateGameDto from "../../../libs/dtos/update-game-dto";
import useLoading from "../../../libs/hooks/use-loading";
import useService from "../../../libs/hooks/use-service";
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
