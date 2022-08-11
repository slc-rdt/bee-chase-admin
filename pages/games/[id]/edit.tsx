import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
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
  { id: string }
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
  const game = await gameService.getOneById(context.params?.id ?? "");

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
    await doAction(async () => {
      return await gameService.update({ ...game, ...data });
    });
    router.reload();
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold">Details</h2>
      <GameForm
        game={game}
        isLoading={isLoading}
        onGameFormSubmit={onGameFormSubmit}
      />
    </Layout>
  );
};

export default GameDetailEditPage;
