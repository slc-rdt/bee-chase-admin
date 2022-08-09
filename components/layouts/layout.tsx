import {
  ClipboardIcon,
  ClockIcon,
  ColorSwatchIcon,
  FilmIcon,
  FlagIcon,
  MenuIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";

interface IMenu {
  label: string;
  path: string;
  icon: JSX.Element;
  isActive: boolean;
}

function useMenus(): IMenu[] {
  const router = useRouter();
  const { isReady, pathname, query, asPath } = router;
  console.log(router);

  const isGameDetail = pathname.startsWith("/games/[id]");
  if (!isReady || !isGameDetail || !query.id) return [];

  return [
    {
      label: "Details",
      path: `/games/${query.id}/edit`,
      icon: <ClipboardIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Missions",
      path: `/games/${query.id}/missions`,
      icon: <FlagIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Script",
      path: `/games/${query.id}/script`,
      icon: <FilmIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Branding",
      path: `/games/${query.id}/branding`,
      icon: <ColorSwatchIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Participants",
      path: `/games/${query.id}/participants`,
      icon: <UserGroupIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Start & End",
      path: `/games/${query.id}/start-end`,
      icon: <ClockIcon className="h-6 w-6" />,
      isActive: false,
    },
  ].map((menu) => {
    const sanitizedPath = new URL(menu.path, location.href).pathname;
    const sanitizedAsPath = new URL(asPath, location.href).pathname;
    menu.isActive = sanitizedPath.startsWith(sanitizedAsPath);
    return menu;
  });
}

const Layout: ComponentType<ComponentProps<"div">> = ({ children }) => {
  const menus = useMenus();

  return (
    <div className="drawer-mobile drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <nav className="navbar bg-base-100 shadow-xl">
          <div className="flex-1">
            {menus.length > 0 && (
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="my-drawer-3"
                  className="btn btn-ghost btn-square"
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
                  <img src="https://placeimg.com/80/80/people" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {children}
      </div>

      {menus.length > 0 && (
        <nav className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu w-80 overflow-y-auto bg-base-100 p-4">
            {menus.map((menu) => (
              <li
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

export default Layout;
