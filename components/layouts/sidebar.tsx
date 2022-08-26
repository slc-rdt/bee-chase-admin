import Link from "next/link";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useCurrentGame from "../../libs/hooks/layout/use-current-game";
import useSidebarMenus from "../../libs/hooks/layout/use-sidebar-menus";

const Sidebar: ComponentType<ComponentProps<"nav">> = ({ ...rest }) => {
  const { game } = useCurrentGame();
  const sidebarMenus = useSidebarMenus(game);

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

  const hasNoSidebarMenus = sidebarMenus.length === 0;

  return (
    <nav
      className={`drawer-side shadow-xl ${hasNoSidebarMenus && "w-0"}`}
      {...rest}
    >
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>

      <div
        className={`menu overflow-y-auto bg-base-100 p-4 ${
          hasNoSidebarMenus ? "w-0" : "w-80"
        }`}
      >
        <ul>
          {sidebarMenus.map((menu, idx) =>
            menu ? (
              <li
                key={menu.path}
                className={`${
                  menu.isActive && "bg-primary text-base-100"
                } rounded-box`}
              >
                <Link href={menu.path}>
                  <a>
                    {menu.isActive ? menu.activeIcon : menu.icon}
                    {menu.label}
                  </a>
                </Link>
              </li>
            ) : (
              <div className="divider" key={idx} />
            )
          )}
        </ul>

        <div className="flex h-full flex-col justify-end">
          <h2 className="mb-4">Join Code</h2>

          <button
            onClick={onGameCodeClick}
            className="btn btn-secondary btn-block"
          >
            {game?.access_code}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
