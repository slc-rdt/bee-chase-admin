import { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import GameTeam from "../../libs/models/game-team";

type GameTeamFormValues = GameTeam;

interface IGameTeamForm {
  gameTeam?: GameTeam;
  onGameTeamFormSubmit: (data: GameTeamFormValues) => {};
  isLoading: boolean;
}

const GameTeamForm: ComponentType<ComponentProps<"div"> & IGameTeamForm> = ({
  gameTeam,
  onGameTeamFormSubmit,
  isLoading,
  ...rest
}) => {
  const { register, handleSubmit } = useForm<GameTeam>({
    defaultValues: gameTeam,
  });

  const onSubmit = handleSubmit(onGameTeamFormSubmit);

  return (
    <div className="card shadow-xl" {...rest}>
      <form onSubmit={onSubmit} className="card-body">
        <section className="w-fulle form-control">
          <label className="label">
            <span className="label-text">Team Color</span>
          </label>
          <input
            {...register("color")}
            type="color"
            className="input input-bordered w-full"
            disabled={isLoading}
            required
          />
        </section>

        <section className="w-fulle form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            {...register("name")}
            type="text"
            className="input input-bordered w-full"
            disabled={isLoading}
            required
          />
        </section>

        <section className="w-fulle form-control">
          <label className="label">
            <span className="label-text">Passcode (Optional)</span>
          </label>
          <input
            {...register("access_code")}
            type="text"
            className="input input-bordered w-full"
            disabled={isLoading}
            minLength={4}
          />
        </section>

        <div className="card-actions justify-end">
          <button
            type="submit"
            className={`btn btn-primary ${isLoading && "loading"}`}
            disabled={isLoading}
          >
            {gameTeam ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameTeamForm;
