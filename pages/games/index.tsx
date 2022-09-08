import { ArrowDownOnSquareIcon, PlusIcon } from "@heroicons/react/20/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import Pagination from "../../components/common/pagination";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import useDownloadBlob from "../../libs/hooks/common/use-download-blob";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
import createServerSideService from "../../libs/utils/create-server-side-service";
import handleServerSideError from "../../libs/utils/handle-server-side-error";

const SearchBar = dynamic(() => import("../../components/common/search-bar"));
const GameCard = dynamic(() => import("../../components/game/game-card"));

export const getServerSideProps: GetServerSideProps<{
  page: number;
  paginatedGames: PaginateResponseDto<Game>;
}> = async (context) => {
  try {
    const gameService = await createServerSideService(context.req, GameService);
    const page = Number(context.query.page ?? 1);
    const q = context.query.q?.toString() ?? "";
    const paginatedGames = await gameService.getAllPaginated({ page, q });

    return {
      props: {
        page,
        paginatedGames,
      },
    };
  } catch (error) {
    return handleServerSideError(error);
  }
};

const GamesPage = ({
  page,
  paginatedGames,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const gameService = useService(GameService);
  const downloadBlob = useDownloadBlob();
  const { isLoading, doAction } = useLoading();

  const onExport = async () => {
    const exportedGame = await doAction(gameService.export());
    downloadBlob(...exportedGame);
  };

  return (
    <div className="mx-auto mt-8 max-w-screen-lg">
      <section className="flex flex-wrap justify-between gap-4">
        <h1 className="text-2xl font-bold">My Games</h1>

        <section className="flex flex-wrap gap-2">
          <Link href="/games/create">
            <a className="btn btn-primary gap-2">
              <PlusIcon className="h-5 w-5" />
              New Game
            </a>
          </Link>

          <button
            onClick={onExport}
            disabled={isLoading}
            className={`btn btn-secondary gap-2 ${isLoading && "loading"}`}
          >
            {!isLoading && <ArrowDownOnSquareIcon className="h-5 w-5" />}
            Export all games
          </button>
        </section>
      </section>

      <SearchBar pathname="/games" className="my-4" />

      <Pagination
        pagination={paginatedGames}
        currentPage={page}
        render={(game) => <GameCard key={game.id} game={game} />}
      />
    </div>
  );
};

export default GamesPage;
