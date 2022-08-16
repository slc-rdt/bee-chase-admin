import { PlusIcon } from "@heroicons/react/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getToken } from "next-auth/jwt";
import Link from "next/link";
import Pagination from "../../components/common/pagination";
import GameCard from "../../components/game/game-card";
import { redirectToLogin } from "../../libs/constants";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";

export const getServerSideProps: GetServerSideProps<{
  page: number;
  paginatedGames: PaginateResponseDto<Game>;
}> = async (context) => {
  const token = await getToken({ req: context.req });

  if (!token?.user) {
    return redirectToLogin;
  }

  const user = token.user;
  const gameService = new GameService(user.access_token);
  const page = Number(context.query.page ?? 1);
  const paginatedGames = await gameService.getAllPaginated({ page });

  return {
    props: {
      page,
      paginatedGames,
    },
  };
};

const GamesPage = ({
  page,
  paginatedGames,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <main className="container mx-auto mt-8">
        <section className="flex justify-between">
          <h1 className="text-2xl font-bold">My Games</h1>
          <Link href="/games/create">
            <button className="btn btn-primary gap-2">
              <PlusIcon className="h-5 w-5" />
              New Game
            </button>
          </Link>
        </section>

        <Pagination
          pagination={paginatedGames}
          currentPage={page}
          render={(game) => <GameCard key={game.id} game={game} />}
        />
      </main>
    </>
  );
};

export default GamesPage;
