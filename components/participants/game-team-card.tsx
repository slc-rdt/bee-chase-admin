import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/use-loading";
import useService from "../../libs/hooks/use-service";
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
    await toast.promise(
      doAction(async () => await gameTeamService.delete(team)),
      {
        loading: `Deleting team ${gameTeam.name}...`,
        success: `Success deleted team ${gameTeam.name}!`,
        error: `Failed to delete team ${gameTeam.name}.`,
      }
    );

    router.push(router.asPath);
  };

  return (
    <div key={gameTeam.id} className={`card shadow-xl ${isLoading && "animate-pulse"}`}>
      <div className="card-body">
        <h3 className="card-title">{gameTeam.name}</h3>
        <p>
          {gameTeam.access_code
            ? `Passcode: ${gameTeam.access_code}`
            : "No passcode"}
        </p>

        <div className="card-actions justify-end">
          <Link
            href={`/games/${gameTeam.game_id}/participants/${gameTeam.id}/edit`}
          >
            <button disabled={isLoading} className="btn btn-secondary gap-2">
              <PencilIcon className="h-5 w-5" />
              Edit
            </button>
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
