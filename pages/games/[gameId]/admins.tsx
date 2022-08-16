import { SearchIcon } from "@heroicons/react/outline";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import AddAdminUserCard from "../../../components/add-admin/add-admin-user-card";
import Game from "../../../libs/models/game";
import User from "../../../libs/models/user";
import GameService from "../../../libs/services/game-service";
import UserService from "../../../libs/services/user-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  {
    game: Game;
    users: User[];
  },
  { gameId: string }
> = async (context) => {
  const [userService, gameService] = await Promise.all([
    createServerSideService(context.req, UserService),
    createServerSideService(context.req, GameService),
  ]);

  const keyword = context.query?.search ?? "";
  const gameId = context.params?.gameId ?? "";

  const [users, game] = await Promise.all([
    userService.search(`${keyword}`),
    gameService.getOneById(gameId),
  ]);

  return {
    props: {
      game,
      users,
    },
  };
};

const AdminsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ game, users }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ keyword: string }>();
  const onSubmit = handleSubmit(async (data) => {
    router.push(
      `/games/${router.query.gameId}/admins/add-admin?search=${data.keyword}`
    );
  });

  return (
    <>
      <section className="form-control">
        <form onSubmit={onSubmit} className="input-group">
          <input
            {...register("keyword")}
            type="text"
            placeholder="Search..."
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary btn-square">
            <SearchIcon className="h-6 w-6" />
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4">
        {users.length === 0 && (
          <div className="card shadow-xl">
            <div className="card-body">
              <h2 className="font-lg text-center font-medium">No users.</h2>
            </div>
          </div>
        )}

        {users.map((user) => (
          <AddAdminUserCard key={user.id} game={game} user={user} />
        ))}
      </section>
    </>
  );
};

export default AdminsPage;
