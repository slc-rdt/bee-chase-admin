import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import GameTeam from "../../libs/models/game-team";
import GameTeamService from "../../libs/services/game-team-service";

interface ITeamCard {
  gameTeam: GameTeam;
}

const GameTeamCard: ComponentType<ComponentProps<"div"> & ITeamCard> = ({
  gameTeam,
}) => {
  const router = useRouter();
  const gameTeamService = useService(GameTeamService);
  const { isLoading, doAction } = useLoading();

  const onDelete = async (team: GameTeam) => {
    await toast.promise(doAction(gameTeamService.delete(team)), {
      loading: `Deleting team ${gameTeam.name}...`,
      success: `Success deleted team ${gameTeam.name}!`,
      error: `Failed to delete team ${gameTeam.name}.`,
    });

    router.push(router.asPath);
  };

  return (
    <div
      key={gameTeam.id}
      className={`card card-side shadow-xl ${isLoading && "animate-pulse"}`}
    >
      <section className="ml-6 mt-10">
        <div
          className="h-10 w-10 rounded-full border"
          style={{ backgroundColor: gameTeam.color }}
        />
      </section>

      <div className="card-body">
        <Link
          href={`/games/${gameTeam.game_id}/submissions/team/${gameTeam.id}`}
        >
          <a className="link card-title link-primary">{gameTeam.name}</a>
        </Link>

        <p>
          {gameTeam.access_code
            ? `Passcode: ${gameTeam.access_code}`
            : "No passcode"}
        </p>

        <div className="card-actions justify-end">
          <Link
            href={`/games/${gameTeam.game_id}/participants/${gameTeam.id}/edit`}
          >
            <a className="btn btn-secondary gap-2">
              <PencilIcon className="h-5 w-5" />
              Edit
            </a>
          </Link>

          <button
            onClick={() => onDelete(gameTeam)}
            className="btn btn-error gap-2"
            disabled={isLoading}
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameTeamCard;
