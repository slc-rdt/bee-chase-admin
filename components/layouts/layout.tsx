import {
  ClipboardIcon,
  ClockIcon,
  FilmIcon,
  FlagIcon,
  MenuIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType, useEffect, useState } from "react";
import LoginDto from "../../libs/dtos/login-dto";

const Layout: ComponentType<ComponentProps<"div">> = ({
  children,
  ...rest
}) => {
  const { data, status } = useSession();
  const router = useRouter();
  const sidebarMenus = useSidebarMenus();

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  const user = data?.user as LoginDto;

  const onLogout = async () => {
    const data = await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });
    router.push(data.url);
  };

  return (
    <div className="drawer-mobile drawer" {...rest}>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
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
              <label tabIndex={0} className="avatar btn btn-ghost btn-circle">
                <div className="w-10 rounded-full">
                  {status === "loading" && (
                    <div className="h-full w-full animate-pulse bg-base-300" />
                  )}

                  {status !== "loading" && (
                    <Image
                      src={user?.picture_url}
                      alt="avatar"
                      width={40}
                      height={40}
                    />
                  )}
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

        <main className="mx-auto w-full max-w-screen-lg p-8">{children}</main>
      </div>

      {sidebarMenus.length > 0 && (
        <nav className="drawer-side shadow-xl">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu w-80 overflow-y-auto bg-base-100 p-4">
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
        </nav>
      )}
    </div>
  );
};

interface IMenu {
  label: string;
  path: string;
  icon: JSX.Element;
  isActive: boolean;
}

function useSidebarMenus(): IMenu[] {
  const router = useRouter();
  const [menus, setMenus] = useState<IMenu[]>([]);
  const { isReady, pathname, query, asPath } = router;
  const gameId = query.gameId;

  useEffect(() => {
    const isGameDetail = pathname.startsWith("/games/[gameId]");

    if (typeof window === "undefined" || !isReady || !isGameDetail || !gameId) {
      setMenus([]);
      return;
    }

    const originalMenus: IMenu[] = [
      {
        label: "Details",
        path: `/games/${gameId}/edit`,
        icon: <ClipboardIcon className="h-6 w-6" />,
        isActive: false,
      },
      {
        label: "Missions",
        path: `/games/${gameId}/missions`,
        icon: <FlagIcon className="h-6 w-6" />,
        isActive: false,
      },
      {
        label: "Script",
        path: `/games/${gameId}/script`,
        icon: <FilmIcon className="h-6 w-6" />,
        isActive: false,
      },
      // {
      //   label: "Branding",
      //   path: `/games/${gameId}/branding`,
      //   icon: <ColorSwatchIcon className="h-6 w-6" />,
      //   isActive: false,
      // },
      {
        label: "Participants",
        path: `/games/${gameId}/participants`,
        icon: <UserGroupIcon className="h-6 w-6" />,
        isActive: false,
      },
      {
        label: "Start & End",
        path: `/games/${gameId}/start-end`,
        icon: <ClockIcon className="h-6 w-6" />,
        isActive: false,
      },
    ];

    setMenus(
      originalMenus.map((menu) => {
        const sanitizedPath = new URL(menu.path, location.href).pathname;
        const sanitizedAsPath = new URL(asPath, location.href).pathname;
        menu.isActive = sanitizedAsPath.startsWith(sanitizedPath);
        return menu;
      })
    );
  }, [asPath, gameId, isReady, pathname]);

  return menus;
}

export default Layout;
