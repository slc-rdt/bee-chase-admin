import { DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Pagination from "../../components/common/pagination";
import MissionCard from "../../components/mission/card/mission-card";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import Mission from "../../libs/models/mission";
import GameService from "../../libs/services/game-service";
import MissionService from "../../libs/services/mission-service";
import createServerSideService from "../../libs/utils/create-server-side-service";
import handleServerSideError from "../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<{
  page: number;
  game: Game;
  missionsPaginated: PaginateResponseDto<Mission>;
}> = async (context) => {
  try {
    const gameId = context.query.gameId?.toString() ?? "";
    const page = Number(context.query.page ?? 1);

    const [gameService, missionService] = await Promise.all([
      createServerSideService(context.req, GameService),
      createServerSideService(context.req, MissionService),
    ]);

    const [game, missionsPaginated] = await Promise.all([
      gameService.getOneById(gameId),
      missionService.getAllPaginated(gameId, { page }),
    ]);

    return { props: { page, game, missionsPaginated } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const GameCopyPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, game, missionsPaginated }) => {
  const router = useRouter();
  const gameService = useService(GameService);
  const { isLoading, doAction } = useLoading();

  const onCopy = async () => {
    await toast.promise(doAction(gameService.copy(game.id)), {
      loading: "Copying game...",
      success: "Game copied!",
      error: "Failed to copy game",
    });
    router.push("/games");
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="card top-0 col-span-12 h-min shadow-xl lg:sticky lg:col-span-4">
        <div className="card-body">
          <h2 className="mb-2 text-2xl font-bold">
            Take a gander at this Game!
          </h2>
          <h3 className="mb-2 text-xl font-medium">
            You were invited to make a copy of this Game.
          </h3>
          <h4 className="mb-4">
            To add this Game to your account, click &quot;Make a copy&quot;
            below.
          </h4>
          <button
            disabled={isLoading}
            onClick={onCopy}
            className={`btn btn-primary ${isLoading && "loading"}`}
          >
            {!isLoading && <DocumentDuplicateIcon className="h-5 w-5" />}
            Make a copy
          </button>
        </div>
      </div>

      <section className="col-span-12 lg:col-span-8">
        <h2 className="mb-4 text-3xl font-bold">{game.name}</h2>
        <Pagination
          currentPage={page}
          pagination={missionsPaginated}
          render={(mission) => (
            <MissionCard key={mission.id} mission={mission} />
          )}
        />
      </section>
    </div>
  );
};

export default GameCopyPage;
