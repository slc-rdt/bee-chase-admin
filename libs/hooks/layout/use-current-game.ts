import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import GameService from "../../services/game-service";

export default function useCurrentGame() {
  const router = useRouter();
  const gameId = router.query.gameId;

  const { data, error } = useSWR(`/games/${gameId}`, async () => {
    if (!gameId) {
      return;
    }

    const session = await getSession();
    const gameService = new GameService(session?.user.access_token);
    return await gameService.getOneById(`${router.query.gameId}`);
  });

  return {
    game: data,
    isLoading: !data && !error,
  };
}
