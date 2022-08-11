import { PlusIcon } from "@heroicons/react/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import Layout from "../../components/layouts/layout";
import LoginDto from "../../libs/dtos/login-dto";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import useLoading from "../../libs/hooks/use-loading";
import useService from "../../libs/hooks/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<{
  user?: LoginDto;
  page?: number;
  paginatedGames?: PaginateResponseDto<Game>;
}> = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session?.user)
    return {
      props: {},
      redirect: { destination: "/auth/login", permanent: false },
    };

  const user = session.user as LoginDto;
  const gameService = new GameService(user.access_token);
  const page = Number(context.query.page ?? 1);
  const paginatedGames = await gameService.getAllPaginated({ page });

  return {
    props: {
      user,
      page,
      paginatedGames,
    },
  };
};

const GameIndexPage = ({
  user,
  page,
  paginatedGames,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const gameService = useService(GameService);
  const router = useRouter();
  const { isLoading, doAction } = useLoading();

  const onDelete = (game: Game) => async (e: MouseEvent) => {
    e.preventDefault();
    await doAction(async () => await gameService.delete(game));
    router.push(router.asPath);
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

        <section className="mt-4 grid grid-cols-1 gap-4">
          {paginatedGames?.data.length === 0 && (
            <h2 className="font-lg text-center font-medium">No games yet.</h2>
          )}

          {paginatedGames?.data.map((game) => (
            <Link href={`/games/${game.id}/missions`} key={game.id}>
              <div className="card w-full cursor-pointer bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-24 rounded-xl">
                        <img src="https://placeimg.com/192/192/people" />
                      </div>
                    </div>

                    <h2 className="card-title">{game.name}</h2>

                    <div className="flex flex-grow justify-end">
                      <button
                        disabled={isLoading}
                        onClick={onDelete(game)}
                        type="button"
                        className={`btn btn-error ${isLoading && "loading"}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default GameIndexPage;
