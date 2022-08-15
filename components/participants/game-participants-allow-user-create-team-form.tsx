import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";

interface IGameParticipantsAllowUserCreateTeamForm {
  game: Game;
}

const GameParticipantsAllowUserCreateTeamForm: ComponentType<
  ComponentProps<"section"> & IGameParticipantsAllowUserCreateTeamForm
> = ({ game, ...rest }) => {
  const router = useRouter();
  const gameService = useService(GameService);
  const { isLoading, doAction } = useLoading();

  const doUpdate = async (allow_user_create_team: boolean) => {
    await toast.promise(
      doAction(
        gameService.update({
          ...game,
          allow_user_create_team,
        })
      ),
      {
        loading: `Updating...`,
        success: `Update success!`,
        error: "Update failed.",
      }
    );

    router.push(router.asPath);
  };

  return (
    <section className="form-control my-4" {...rest}>
      <label className="label cursor-pointer justify-start gap-2">
        <input
          onChange={() => doUpdate(!game.allow_user_create_team)}
          disabled={isLoading}
          type="checkbox"
          className="checkbox checkbox-primary"
          defaultChecked={game.allow_user_create_team}
        />
        <span className="label-text">
          Allow participants to create their own teams
        </span>
      </label>

      <label className="label">
        <span className="label-text">
          If disabled, you will need to pre-create all the teams for this Game.
        </span>
      </label>
    </section>
  );
};

export default GameParticipantsAllowUserCreateTeamForm;
