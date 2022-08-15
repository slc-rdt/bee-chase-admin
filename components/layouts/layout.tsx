import { MenuIcon, QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useCurrentGame from "../../libs/hooks/layout/use-current-game";
import useSidebarMenus from "../../libs/hooks/layout/use-sidebar-menus";

const Layout: ComponentType<ComponentProps<"div">> = ({
  children,
  ...rest
}) => {
  const router = useRouter();
  const { data, status } = useSession();
  const { game, isLoading } = useCurrentGame();
  const sidebarMenus = useSidebarMenus(game);

  const user = data?.user;

  const onLogout = async () => {
    const data = await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });

    router.push(data.url);
  };

  const onGameCodeClick = async () => {
    try {
      if (game?.access_code) {
        await navigator.clipboard.writeText(game.access_code);
        toast.success("Code copied to clipboard!");
      }
    } catch (error) {
      toast.success("Failed to copy code to clipboard.");
      console.error(error);
    }
  };

  return (
    <div className="drawer-mobile drawer" {...rest}>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {status === "authenticated" && (
          <nav className="navbar bg-base-100 shadow-xl">
            <div className="flex-1">
              {sidebarMenus.length > 0 && (
                <div className="flex-none lg:hidden">
                  <label
                    htmlFor="my-drawer-3"
                    className="btn btn-square btn-ghost"
                  >
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
              <div className="dropdown-end dropdown">
                <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
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
        )}

        <main className="mx-auto w-full max-w-screen-lg p-8">{children}</main>
      </div>

      {sidebarMenus.length > 0 && (
        <nav className="drawer-side shadow-xl">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>

          <div className="menu w-80 overflow-y-auto bg-base-100 p-4">
            <ul>
              {sidebarMenus.map((menu) => (
                <li
                  key={menu.path}
                  className={`${
                    menu.isActive && "bg-primary text-base-100"
                  } rounded-box`}
                >
                  <Link href={menu.path}>
                    <button>
                      {menu.icon}
                      {menu.label}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex h-full flex-col justify-end">
              <h2 className="mb-4 flex items-center gap-2">
                <span>Join Code</span>
                <div
                  className="tooltip"
                  data-tip="Share this with participants to make it easy to find your Experience! Instead of searching for it by name, they can use this Join Code and be taken directly to your Experience."
                >
                  <QuestionMarkCircleIcon className="h-6 w-6" />
                </div>
              </h2>

              <button
                onClick={onGameCodeClick}
                disabled={isLoading}
                className={`btn btn-secondary btn-block ${
                  isLoading && "loading"
                }`}
              >
                {game?.access_code}
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
