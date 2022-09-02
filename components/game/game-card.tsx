import { ShareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";
import ConfirmationModal from "../common/confirmation-modal";
import GameAccessCodeButton from "./game-access-code-button";
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

  const onShare = async (game: Game) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/games/copy?gameId=${game.id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Share game link copied to clipboard!");
    } catch (error) {
      toast.success("Failed to share game link to clipboard.");
      console.error(error);
    }
  };

  const onDelete = async (game: Game) => {
    await toast.promise(doAction(gameService.delete(game)), {
      loading: "Deleting game...",
      success: "Game deleted!",
      error: "Failed to delete game",
    });
    router.push(router.asPath);
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl" {...rest}>
      <div className="card-body">
        <Link href={`/games/${game.id}/missions`}>
          <a>
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
          </a>
        </Link>

        <section className="card-actions justify-end gap-2">
          <GameAccessCodeButton game={game} />

          <button
            type="button"
            onClick={() => onShare(game)}
            className="btn btn-primary gap-2"
          >
            <ShareIcon className="h-5 w-5" />
            Share
          </button>

          <ConfirmationModal
            modalKey={game.id}
            isLoading={isLoading}
            onConfirm={() => onDelete(game)}
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </ConfirmationModal>
        </section>
      </div>
    </div>
  );
};

export default GameCard;
