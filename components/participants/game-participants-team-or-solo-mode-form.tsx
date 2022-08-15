import { useRouter } from "next/router";
import React, {
  ComponentProps,
  ComponentType,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import GameService from "../../libs/services/game-service";

interface IGameParticipantsTeamOrSoloModeForm {
  game: Game;
}

const GameParticipantsTeamOrSoloModeForm: ComponentType<
  ComponentProps<"section"> & IGameParticipantsTeamOrSoloModeForm
> = ({ game, ...rest }) => {
  const router = useRouter();
  const gameService = useService(GameService);
  const { isLoading, doAction } = useLoading();

  const doUpdate = async (is_solo: boolean) => {
    await toast.promise(
      doAction(
        gameService.update({
          ...game,
          is_solo,
        })
      ),
      {
        loading: "Updating game team participants mode...",
        success: "Game team participants mode updated!",
        error: "Failed to update game team participants mode.",
      }
    );

    router.push(router.asPath);
  };

  return (
    <section className="form-control my-4 w-full" {...rest}>
      <label className="label">
        <span className="label-text">How would you like people to join?</span>
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="label cursor-pointer gap-2">
          <input
            onChange={() => doUpdate(false)}
            disabled={isLoading}
            type="radio"
            name="is_solo"
            className="radio radio-primary"
            defaultChecked={!game.is_solo}
          />
          <span className="label-text">In teams</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input
            onChange={() => doUpdate(true)}
            disabled={isLoading}
            type="radio"
            name="is_solo"
            value="true"
            className="radio radio-primary"
            defaultChecked={game.is_solo}
          />
          <span className="label-text">Solo</span>
        </label>
      </div>

      <label className="label">
        <span className="label-text-alt">
          Participants collect points as teams, collaborating with others or as
          teams of one. You can pre-create teams below, or participants can make
          their own!
        </span>
      </label>
    </section>
  );
};

export default GameParticipantsTeamOrSoloModeForm;
