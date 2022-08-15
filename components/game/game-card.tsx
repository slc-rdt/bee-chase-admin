import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import useLoading from "../../libs/hooks/use-loading";
import useService from "../../libs/hooks/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";

interface IGameCard {
  game: Game;
}

const GameCard: ComponentType<ComponentProps<"div"> & IGameCard> = ({
  game,
  ...rest
}) => {
  const gameService = useService(GameService);
  const router = useRouter();
  const { isLoading, doAction } = useLoading();

  const onDelete = async (game: Game) => {
    await doAction(async () => await gameService.delete(game));
    router.push(router.asPath);
  };

  return (
    <Link href={`/games/${game.id}/missions`}>
      <div
        className="card w-full cursor-pointer bg-base-100 shadow-xl"
        {...rest}
      >
        <div className="card-body">
          <section>
            <h2 className="card-title">{game.name}</h2>
            <p className="truncate">{game.description}</p>
          </section>

          <section className="flex flex-grow justify-end">
            <button
              type="button"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(game);
              }}
              className={`btn btn-error ${isLoading && "loading"}`}
            >
              Delete
            </button>
          </section>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
