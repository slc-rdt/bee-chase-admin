import {
  ClipboardIcon,
  FlagIcon,
  UserGroupIcon,
  ClockIcon,
  UsersIcon,
  PhotographIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";
import { FilmIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Game from "../../models/game";

interface IMenu {
  label: string;
  path: string;
  icon: JSX.Element;
  isActive: boolean;
}

type MenuItem = IMenu | null;

export default function useSidebarMenus(game?: Game) {
  const router = useRouter();
  const [menus, setMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    const gameId = game?.id;

    if (!gameId) {
      setMenus([]);
      return;
    }

    const originalMenus: MenuItem[] = [
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
        label: "Automations",
        path: `/games/${gameId}/automations`,
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
      {
        label: "Admins",
        path: `/games/${gameId}/admins`,
        icon: <UsersIcon className="h-6 w-6" />,
        isActive: false,
      },

      null,

      {
        label: "Leaderboard",
        path: `/games/${gameId}/leaderboard`,
        icon: <ChartBarIcon className="h-6 w-6" />,
        isActive: false,
      },
      {
        label: "Submissions",
        path: `/games/${gameId}/submissions`,
        icon: <PhotographIcon className="h-6 w-6" />,
        isActive: false,
      },
    ];

    setMenus(
      originalMenus.map((menu) => {
        if (!menu) return menu;
        const sanitizedPath = new URL(menu.path, location.href).pathname;
        const sanitizedAsPath = new URL(router.asPath, location.href).pathname;
        menu.isActive = sanitizedAsPath.startsWith(sanitizedPath);
        return menu;
      })
    );
  }, [game, router.asPath]);

  return menus;
}
