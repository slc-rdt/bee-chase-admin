import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useSWR from "swr";
import Skeleton from "../../../components/common/skeleton";
import useService from "../../../libs/hooks/common/use-service";
import Game from "../../../libs/models/game";
import UserService from "../../../libs/services/user-service";

const GameCard = dynamic(() => import("../../../components/game/game-card"));

const UserGamesPage = () => {
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
      <h2 className="mb-4 text-3xl font-bold">User&apos;s Games</h2>

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
