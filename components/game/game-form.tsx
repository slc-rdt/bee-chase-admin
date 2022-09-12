import { ComponentProps, ComponentType } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CreateGameDto from "../../libs/dtos/create-game-dto";
import UpdateGameDto from "../../libs/dtos/update-game-dto";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import Tag from "../../libs/models/tag";
import TagService from "../../libs/services/tag-service";

type GameFormValues = CreateGameDto | UpdateGameDto;

// export interface GameFormValues {
//   // photo: File;
//   name: string;
//   description: string;
//   password: string;
// }

interface IGameForm {
  game?: Game;
  tags: Tag[];
  onGameFormSubmit: (data: GameFormValues) => Promise<void>;
}

const GameForm: ComponentType<ComponentProps<"div"> & IGameForm> = ({
  game,
  tags,
  onGameFormSubmit,
  ...rest
}) => {
  const currentTag = tags.find((tag) => tag.id === game?.tag_id);

  const tagService = useService(TagService);
  const { isLoading, doAction } = useLoading();
  const { register, handleSubmit, watch } = useForm<GameFormValues>({
    defaultValues: {
      tag_name: currentTag?.name,
    },
  });

  console.log(currentTag, watch("tag_name"), game);

  const onSubmit = handleSubmit(async (data) => {
    let tag = tags.find((tag) => tag.name === data.tag_name);

    if (!tag) {
      tag = await doAction(
        toast.promise(tagService.create({ name: data.tag_name }), {
          loading: "Creating tag...",
          success: "Tag created!",
          error: "Failed to create tag.",
        })
      );
    }

    data.tag_id = tag.id;

    const createMessages = {
      loading: "Creating game...",
      success: "Game created!",
      error: "Failed to create game.",
    };

    const updateMessages = {
      loading: "Updating game...",
      success: "Game saved!",
      error: "Failed to save game.",
    };

    await doAction(
      toast.promise(
        onGameFormSubmit(data),
        game ? updateMessages : createMessages
      )
    );
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
              <span className="label-text">Tag</span>
            </label>
            <input
              list="tags"
              {...register("tag_name")}
              type="text"
              disabled={isLoading}
              className="input input-bordered w-full"
              defaultValue={currentTag?.name}
              required
            />
            <label className="label">
              <span className="label-text-alt">
                To view all available tags, please clear then click the input
                field.
              </span>
            </label>

            <datalist id="tags">
              {tags.map((tag) => (
                <option key={tag.id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </datalist>
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
