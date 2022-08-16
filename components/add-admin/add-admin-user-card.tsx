import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Game from "../../libs/models/game";
import User from "../../libs/models/user";
import GameService from "../../libs/services/game-service";

interface IAddAdminUserCard {
  game: Game;
  user: User;
}

const AddAdminUserCard: ComponentType<
  ComponentProps<"div"> & IAddAdminUserCard
> = ({ game, user, ...rest }) => {
  const isAlreadyAdmin = !!game.admins?.find((admin) => admin.id === user.id);

  const router = useRouter();
  const gameService = useService(GameService);
  const { isLoading, doAction } = useLoading();

  const onCheck = async (isAddAdmin: boolean) => {
    const action = isAddAdmin
      ? gameService.addAdmin(game, user)
      : gameService.removeAdmin(game, user);

    await toast.promise(doAction(action), {
      loading: `${isAddAdmin ? "Adding" : "Removing"} user as admin...`,
      success: `Success ${isAddAdmin ? "add" : "remove"} user as admin.`,
      error: `Failed to ${isAddAdmin ? "add" : "remove"} user as admin.`,
    });

    router.push(router.asPath);
  };

  return (
    <div className="card shadow-xl" {...rest}>
      <div className="card-body">
        <div className="flex items-center gap-4">
          <section>
            <input
              onChange={(e) => onCheck(e.target.checked)}
              type="checkbox"
              className="checkbox checkbox-primary"
              defaultChecked={isAlreadyAdmin}
            />
          </section>

          <section>
            <h2 className="card-title">{user.name}</h2>
            <p>
              {user.email} | {user.username}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddAdminUserCard;
