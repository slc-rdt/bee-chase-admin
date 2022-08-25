import { PlusIcon } from "@heroicons/react/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Pagination from "../../components/common/pagination";
import GameCard from "../../components/game/game-card";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
import createServerSideService from "../../libs/utils/create-server-side-service";
import handleServerSideError from "../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<{
  page: number;
  paginatedGames: PaginateResponseDto<Game>;
}> = async (context) => {
  try {
    const gameService = await createServerSideService(context.req, GameService);
    const page = Number(context.query.page ?? 1);
    const paginatedGames = await gameService.getAllPaginated({ page });

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
  return (
    <div className="mx-auto mt-8 max-w-screen-lg">
      <section className="flex justify-between">
        <h1 className="text-2xl font-bold">My Games</h1>
        <Link href="/games/create">
          <a className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            New Game
          </a>
        </Link>
      </section>

      <Pagination
        pagination={paginatedGames}
        currentPage={page}
        render={(game) => <GameCard key={game.id} game={game} />}
      />
    </div>
  );
};

export default GamesPage;
