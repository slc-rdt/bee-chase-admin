import { useContext } from "react";
import { currentlyViewedGameContext } from "../../contexts/currently-viewed-game-context";

export default function useCurrentGame() {
  const game = useContext(currentlyViewedGameContext);
  return { game, isLoading: false };
}
