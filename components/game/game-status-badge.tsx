import { ComponentProps, ComponentType } from "react";
import { GameStatus } from "../../libs/enums";
import Game from "../../libs/models/game";
import getGameStatus from "../../libs/utils/get-game-status";

interface IGameStatusBadge {
  game?: Game;
  isLoading?: boolean;
}

const GameStatusBadge: ComponentType<
  ComponentProps<"button"> & IGameStatusBadge
> = ({ game, isLoading, ...rest }) => {
  const gameStatus = getGameStatus(game); 

  return (
    <button
      type="button"
      disabled={isLoading}
      className={`btn no-animation ${isLoading && "btn-square loading"} ${
        {
          [GameStatus.DRAFT]: "btn-warning",
          [GameStatus.SCHEDULED]: "btn-info",
          [GameStatus.LIVE]: "btn-success",
          [GameStatus.ENDED]: "btn-outline btn-ghost",
          [GameStatus.UNKNOWN]: "",
        }[gameStatus]
      }`}
      {...rest}
    >
      {!isLoading && Object.values(GameStatus)[gameStatus]}
    </button>
  );
};

export default GameStatusBadge;
