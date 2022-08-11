import {
  ClipboardIcon,
  ClockIcon,
  ColorSwatchIcon,
  FilmIcon,
  FlagIcon,
  MenuIcon,
  UserGroupIcon
} from "@heroicons/react/outline";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";

const Layout: ComponentType<ComponentProps<"div">> = ({ children }) => {
  const router = useRouter();
  const sidebarMenus = useSidebarMenus();

  const onLogout = async () => {
    const data = await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });
    router.push(data.url);
  };

  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <nav className="navbar bg-base-100 shadow-xl">
          <div className="flex-1">
            {sidebarMenus.length > 0 && (
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
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="avatar btn btn-ghost btn-circle">
                <div className="w-10 rounded-full">
                  <img src="https://placeimg.com/80/80/people" />
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

        <main className="container mx-auto p-8">{children}</main>
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
  const { isReady, pathname, query, asPath } = router;

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

export default Layout;
