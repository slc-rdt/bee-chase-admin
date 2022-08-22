import { TrashIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
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
    await toast.promise(doAction(gameService.delete(game)), {
      loading: "Deleting game...",
      success: "Game deleted!",
      error: "Failed to delete game",
    });
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
              className={`btn btn-error gap-2 ${isLoading && "loading"}`}
            >
              <TrashIcon className="h-5 w-5" />
              Delete
            </button>
          </section>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
