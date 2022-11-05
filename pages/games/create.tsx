import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameForm from "../../components/game/game-form";
import CreateGameDto from "../../libs/dtos/create-game-dto";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Tag from "../../libs/models/tag";
import GameService from "../../libs/services/game-service";
import TagService from "../../libs/services/tag-service";
import createServerSideService from "../../libs/utils/create-server-side-service";
import handleServerSideError from "../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<{ tags: Tag[] }> = async (
  context
) => {
  try {
    const tagService = await createServerSideService(context.req, TagService);
    const tags = await tagService.getAll();
    return { props: { tags } };
  } catch (error) {
    return handleServerSideError(error);
  }
};

const GameCreatePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tags }) => {
  const router = useRouter();
  const gameService = useService(GameService);

  const onGameFormSubmit = async (data: CreateGameDto) => {
    const response = await gameService.create(data);
    router.push(`/games/${response.id}/missions`);
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <h2 className="text-3xl font-bold">Details</h2>
      <GameForm tags={tags} onGameFormSubmit={onGameFormSubmit} />
    </div>
  );
};

export default GameCreatePage;
