import { PlusIcon } from "@heroicons/react/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import Pagination from "../../components/common/pagination";
import PaginationButtons from "../../components/common/pagination-buttons";
import GameCard from "../../components/game/game-card";
import Layout from "../../components/layouts/layout";
import LoginDto from "../../libs/dtos/login-dto";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<{
  page: number;
  paginatedGames: PaginateResponseDto<Game>;
}> = async (context) => {
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
  const router = useRouter();

  const onChangePage = (page: number) => {
    router.push(`/games?page=${page}`);
  };

  return (
    <Layout>
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

        {/* <section className="mt-4 grid grid-cols-1 gap-4">
          {paginatedGames?.data.length === 0 && (
            <h2 className="font-lg text-center font-medium">No games yet.</h2>
          )}

          {paginatedGames?.data.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}

          <PaginationButtons
            length={paginatedGames?.last_page}
            currentPage={page}
            onChangePage={onChangePage}
          />
        </section> */}
      </main>
    </Layout>
  );
};

export default GamesPage;
