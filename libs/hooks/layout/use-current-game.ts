import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import GameService from "../../services/game-service";
import useService from "../common/use-service";

export default function useCurrentGame() {
  const router = useRouter();
  const { status } = useSession();
  const gameService = useService(GameService);

  const gameId = router.query.gameId;

  const { data, error, isValidating } = useSWR(
    status === "authenticated" && gameId ? `/games/${gameId}` : null,
    async () => await gameService.getOneById(`${router.query.gameId}`)
  );

  return {
    game: data,
    isLoading: (!data && !error) || isValidating,
  };
}
