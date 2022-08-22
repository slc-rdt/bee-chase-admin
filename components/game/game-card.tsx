import { TrashIcon } from "@heroicons/react/solid";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
import GameStatusBadge from "./game-status-badge";

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
            <header className="flex flex-wrap items-center gap-4">
              <h2 className="card-title">{game.name}</h2>
              <div>
                <GameStatusBadge game={game} />
              </div>
            </header>

            <p className="my-4 truncate">{game.description}</p>

            <section className="font-medium">
              {game.start_time && (
                <p>
                  Start:{" "}
                  {DateTime.fromISO(game.start_time.toString())
                    .toUTC()
                    .toLocal()
                    .toFormat("yyyy LLL dd 'at' HH:mm")}
                </p>
              )}

              {game.end_time && (
                <p>
                  End:{" "}
                  {DateTime.fromISO(game.end_time.toString())
                    .toUTC()
                    .toLocal()
                    .toFormat("yyyy LLL dd 'at' HH:mm")}
                </p>
              )}
            </section>
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
