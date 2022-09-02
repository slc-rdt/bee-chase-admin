import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import AddAdminUserCard from "../../../components/add-admin/add-admin-user-card";
import Pagination from "../../../components/common/pagination";
import SearchBar from "../../../components/common/search-bar";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import Game from "../../../libs/models/game";
import User from "../../../libs/models/user";
import GameService from "../../../libs/services/game-service";
import UserService from "../../../libs/services/user-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  {
    gameId: string;
    game: Game;
    pagintedUsers: PaginateResponseDto<User>;
    page: number;
  },
  { gameId: string }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";
    const page = Number(context.query.page ?? 1);
    const q = context.query.q?.toString() ?? "";

    const [userService, gameService] = await Promise.all([
      createServerSideService(context.req, UserService),
      createServerSideService(context.req, GameService),
    ]);

    const [users, game] = await Promise.all([
      userService.search({ page, q }),
      gameService.getOneById(gameId),
    ]);

    return {
      props: {
        gameId,
        game,
        pagintedUsers: users,
        page,
      },
    };
  } catch (error) {
    return handleServerSideError(error, {
      destination: `/games`,
      permanent: false,
    });
  }
};

const AdminsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameId, game, pagintedUsers, page }) => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <h2 className="mb-2 text-3xl font-bold">Manage Admins</h2>

      <SearchBar pathname={`/games/${gameId}/admins`} />

      <section className="grid grid-cols-1 gap-4">
        <Pagination
          currentPage={page}
          pagination={pagintedUsers}
          render={(user) => (
            <AddAdminUserCard key={user.id} game={game} user={user} />
          )}
        />
      </section>
    </div>
  );
};

export default AdminsPage;
