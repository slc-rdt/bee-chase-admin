import { SearchIcon } from "@heroicons/react/outline";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import AddAdminUserCard from "../../../components/add-admin/add-admin-user-card";
import Pagination from "../../../components/common/pagination";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import Game from "../../../libs/models/game";
import User from "../../../libs/models/user";
import GameService from "../../../libs/services/game-service";
import UserService from "../../../libs/services/user-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  {
    game: Game;
    pagintedUsers: PaginateResponseDto<User>;
    page: number;
  },
  { gameId: string }
> = async (context) => {
  const [userService, gameService] = await Promise.all([
    createServerSideService(context.req, UserService),
    createServerSideService(context.req, GameService),
  ]);

  const gameId = context.params?.gameId ?? "";
  const keyword = context.query.search ?? "";
  const page = Number(context.query.page ?? 1);

  const [users, game] = await Promise.all([
    userService.search({ search: `${keyword}`, page }),
    gameService.getOneById(gameId),
  ]);

  return {
    props: {
      game,
      pagintedUsers: users,
      page,
    },
  };
};

const AdminsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ game, pagintedUsers, page }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ keyword: string }>();
  const { isLoading, doAction } = useLoading();

  const onSubmit = handleSubmit((data) => {
    doAction(
      router.push(`/games/${router.query.gameId}/admins?search=${data.keyword}`)
    );
  });

  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Manage Admins</h2>

      <section className="form-control">
        <form onSubmit={onSubmit} className="input-group">
          <input
            {...register("keyword")}
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-square btn-primary ${
              isLoading && "btn-square loading"
            }`}
          >
            {!isLoading && <SearchIcon className="h-6 w-6" />}
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <Pagination
          currentPage={page}
          pagination={pagintedUsers}
          render={(user) => (
            <AddAdminUserCard key={user.id} game={game} user={user} />
          )}
        />
      </section>
    </>
  );
};

export default AdminsPage;
