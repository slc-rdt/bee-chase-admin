import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameForm from "../../../components/game/game-form";
import UpdateGameDto from "../../../libs/dtos/update-game-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Game from "../../../libs/models/game";
import Tag from "../../../libs/models/tag";
import GameService from "../../../libs/services/game-service";
import TagService from "../../../libs/services/tag-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  { game: Game; tags: Tag[] },
  { gameId: string }
> = async (context) => {
  try {
    const [gameService, tagService] = await Promise.all([
      createServerSideService(context.req, GameService),
      createServerSideService(context.req, TagService),
    ]);

    const [game, tags] = await Promise.all([
      gameService.getOneById(context.params?.gameId ?? ""),
      tagService.getAll(),
    ]);

    return { props: { game, tags } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: `/games`,
      permanent: false,
    });
  }
};

const GameDetailEditPage = ({
  game,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const gameService = useService(GameService);

  const onGameFormSubmit = async (data: UpdateGameDto) => {
    await gameService.update({ ...game, ...data });
    router.push(router.asPath);
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <h2 className="mb-2 text-3xl font-bold">Details</h2>
      <GameForm game={game} tags={tags} onGameFormSubmit={onGameFormSubmit} />
    </div>
  );
};

export default GameDetailEditPage;
