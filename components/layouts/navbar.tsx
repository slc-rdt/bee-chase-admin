import { MenuIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import useCurrentGame from "../../libs/hooks/layout/use-current-game";
import useSidebarMenus from "../../libs/hooks/layout/use-sidebar-menus";
import getGameStatus from "../../libs/utils/get-game-status";
import GameStatusBadge from "../game/game-status-badge";

const Navbar: ComponentType<ComponentProps<"nav">> = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const { game, isLoading } = useCurrentGame();
  const sidebarMenus = useSidebarMenus(game);
  const gameStatus = getGameStatus(game);

  const user = data?.user;

  const shouldShowNavbar =
    status === "authenticated" && !router.pathname.startsWith("/auth/login");

  const onLogout = async () => {
    const data = await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });

    router.push(data.url);
  };

  if (!shouldShowNavbar) {
    return <></>;
  }

  return (
    <nav className="navbar bg-base-100 shadow-xl">
      <div className="flex-1">
        {sidebarMenus.length > 0 && (
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <MenuIcon className="inline-block h-6 w-6 stroke-current" />
            </label>
          </div>
        )}

        <Link href="/games">
          <button className="btn btn-ghost text-xl normal-case">
            BeeChase
          </button>
        </Link>
      </div>

      <div className="flex-none gap-2">
        {game && (
          <>
            <GameStatusBadge game={game} />
            <div className="divider divider-horizontal" />
          </>
        )}

        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="avatar btn btn-ghost btn-circle">
            <div className="w-10 rounded-full">
              <Image
                src={
                  user?.picture_url ??
                  `https://ui-avatars.com/api?name=${user?.name}`
                }
                alt="avatar"
                width={40}
                height={40}
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <button onClick={onLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
