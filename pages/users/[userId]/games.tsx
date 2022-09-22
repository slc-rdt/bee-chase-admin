import { AxiosError } from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useSWR from "swr";
import Skeleton from "../../../components/common/skeleton";
import useService from "../../../libs/hooks/common/use-service";
import Game from "../../../libs/models/game";
import UserService from "../../../libs/services/user-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../libs/utils/handle-server-side-error";

const GameCard = dynamic(() => import("../../../components/game/game-card"));

export const getServerSideProps: GetServerSideProps<{
  username: string;
}> = async (context) => {
  try {
    const userId = `${context.params?.userId}`;
    const userService = await createServerSideService(context.req, UserService);
    const user = await userService.getOneById(userId);
    return { props: { username: user.name } };
  } catch (error) {
    return handleServerSideError(error);
  }
};

const UserGamesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ username }) => {
  const router = useRouter();
  const { status } = useSession();
  const userService = useService(UserService);

  const userId = `${router.query.userId}`;

  const { data, error } = useSWR<Game[], AxiosError>(
    status === "authenticated" && userId ? `user:${userId}` : null,
    async () => await userService.games(userId)
  );

  if (error) {
    toast.error(`${error.response?.data ?? error.message}`);
  }

  return (
    <section className="mx-auto max-w-screen-md">
      <h2 className="mb-4 text-3xl font-bold">
        <span className="capitalize">{username.toLowerCase()}</span>&apos;s
        Games
      </h2>

      <section className="grid grid-cols-1 gap-4">
        {!data &&
          Array.from({ length: 20 }).map((_, idx) => (
            <Skeleton className="h-32 w-full" key={idx} />
          ))}

        {data?.length === 0 && (
          <div className="card shadow-xl">
            <div className="card-title justify-center">No data.</div>
          </div>
        )}

        {data?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </section>
    </section>
  );
};

export default UserGamesPage;
