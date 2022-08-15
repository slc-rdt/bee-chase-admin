import { ClipboardIcon, FlagIcon, UserGroupIcon, ClockIcon, UsersIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Game from "../../models/game";

interface IMenu {
  label: string;
  path: string;
  icon: JSX.Element;
  isActive: boolean;
}

export default function useSidebarMenus(game?: Game): IMenu[] {
  const router = useRouter();
  const [menus, setMenus] = useState<IMenu[]>([]);

  useEffect(() => {
    const gameId = game?.id;

    if (!gameId) {
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
      // {
      //   label: "Script",
      //   path: `/games/${gameId}/script`,
      //   icon: <FilmIcon className="h-6 w-6" />,
      //   isActive: false,
      // },
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
      {
        label: "Admins",
        path: `/games/${gameId}/admins`,
        icon: <UsersIcon className="h-6 w-6" />,
        isActive: false,
      },
    ];

    setMenus(
      originalMenus.map((menu) => {
        const sanitizedPath = new URL(menu.path, location.href).pathname;
        const sanitizedAsPath = new URL(router.asPath, location.href).pathname;
        menu.isActive = sanitizedAsPath.startsWith(sanitizedPath);
        return menu;
      })
    );
  }, [game, router.asPath]);

  return menus;
}
