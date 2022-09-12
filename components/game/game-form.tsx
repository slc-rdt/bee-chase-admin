import { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import CreateGameDto from "../../libs/dtos/create-game-dto";
import UpdateGameDto from "../../libs/dtos/update-game-dto";
import Game from "../../libs/models/game";

type GameFormValues = CreateGameDto | UpdateGameDto;

// export interface GameFormValues {
//   // photo: File;
//   name: string;
//   description: string;
//   password: string;
// }

interface IGameForm {
  game?: Game;
  isLoading?: boolean;
  onGameFormSubmit: (data: GameFormValues) => void;
}

const GameForm: ComponentType<ComponentProps<"div"> & IGameForm> = ({
  game,
  isLoading,
  onGameFormSubmit,
  ...rest
}) => {
  const { register, handleSubmit } = useForm<GameFormValues>();

  const onSubmit = handleSubmit((data) => {
    onGameFormSubmit(data);
  });

  return (
    <div className="card w-full bg-base-100 shadow-xl" {...rest}>
      <form onSubmit={onSubmit} className="card-body">
        <div className="grid grid-cols-1 gap-4">
          <section className="form-control w-full">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              {...register("name")}
              type="text"
              disabled={isLoading}
              className="input input-bordered w-full"
              defaultValue={game?.name}
              required
            />
            <label className="label">
              <span className="label-text-alt">
                Every Experience is unique. Give yours a name participants can
                find (and remember)!
              </span>
            </label>
          </section>

          <section className="form-control w-full">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              {...register("description")}
              disabled={isLoading}
              className="textarea textarea-bordered h-24"
              defaultValue={game?.description}
              required
            ></textarea>
            <label className="label">
              <span className="label-text-alt">
                Use this space to describe and build excitement for your
                Experience. You can add information on rules or prizes here,
                too.
              </span>
            </label>
          </section>

          <section className="form-control w-full">
            <label className="label">
              <span className="label-text">Tags</span>
            </label>
            <input
              list="tags"
              {...register("tag_id")}
              type="text"
              disabled={isLoading}
              className="input input-bordered w-full"
              // defaultValue={game?.name}
              required
            />

            <datalist id="tags"></datalist>
          </section>

          <section className="form-control w-full">
            <label className="label">
              <span className="label-text">Password (Optional)</span>
            </label>
            <input
              {...register("password")}
              type="text"
              disabled={isLoading}
              className="input input-bordered w-full"
              defaultValue={game?.password}
            />
            <label className="label">
              <span className="label-text-alt">
                Do not forget to share it with your participants!
              </span>
            </label>
          </section>
        </div>

        <div className="card-actions justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary ${isLoading && "loading"}`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameForm;
