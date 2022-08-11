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
}) => {
  // const [photo, setPhoto] = useState<File | null>(null);
  const { register, handleSubmit } = useForm<GameFormValues>();
  // const openFileChooser = useFileChooser();

  // const onAddPhoto = async () => {
  //   const files = await openFileChooser();
  //   const photo = files?.item(0);
  //   if (photo) setPhoto(photo);
  // };

  const onSubmit = handleSubmit((data) => {
    // if (photo) data.photo = photo;
    onGameFormSubmit(data);
  });

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <form onSubmit={onSubmit} className="card-body">
        <div className="grid grid-cols-1 gap-4">
          {/* <section>
            <h3 className="mb-2 font-medium">Photo</h3>

            <div className="flex flex-wrap gap-4">
              <div className="avatar">
                <div className="h-24 w-24 rounded-xl">
                  <img src="https://placeimg.com/192/192/people" />
                </div>
              </div>

              <div>
                <button onClick={onAddPhoto} className="btn btn-primary gap-2">
                  <PlusIcon className="h-5 w-5" /> Add a photo
                </button>

                <p className="mt-2 w-full max-w-xs">
                  Add a photo to set your Experience apart and help participants
                  find it!
                </p>
              </div>
            </div>
          </section> */}

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
              <span className="label-text">Password (Optional)</span>
            </label>
            <input
              {...register("password")}
              type="password"
              disabled={isLoading}
              className="input input-bordered w-full"
              defaultValue={game?.password}
            />
            <label className="label">
              <span className="label-text-alt">
                Don't forget to share it with your participants!
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
