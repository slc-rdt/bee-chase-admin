import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import GameCard from "../../../components/game/game-card";
import useService from "../../../libs/hooks/common/use-service";
import Game from "../../../libs/models/game";
import UserService from "../../../libs/services/user-service";

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
      <h2 className="text-3xl font-bold">User&apos;s Games</h2>

      <section className="grid grid-cols-1 gap-4">
        {data?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </section>
    </section>
  );
};

export default UserGamesPage;
