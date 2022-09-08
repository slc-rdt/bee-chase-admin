import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
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

  const doUpdate = async (max_player_per_team: number) => {
    await toast.promise(
      doAction(
        gameService.update({
          ...game,
          max_player_per_team,
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
            onChange={() => doUpdate(10)}
            disabled={isLoading}
            type="radio"
            name="is_solo"
            className="radio radio-primary"
            defaultChecked={game.max_player_per_team > 1}
          />
          <span className="label-text">In teams (max. 10 users)</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input
            onChange={() => doUpdate(1)}
            disabled={isLoading}
            type="radio"
            name="is_solo"
            value="true"
            className="radio radio-primary"
            defaultChecked={game.max_player_per_team === 1}
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
