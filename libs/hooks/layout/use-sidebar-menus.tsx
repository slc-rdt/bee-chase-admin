import {
  ChartBarIcon, ClipboardIcon, ClockIcon, CollectionIcon, FlagIcon, PhotographIcon, UserGroupIcon, UsersIcon
} from "@heroicons/react/outline";
import { FilmIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Game from "../../models/game";

interface IMenu {
  label: string;
  path: string;
  icon: JSX.Element;
  isActive: boolean;
}

type MenuItem = IMenu | null;

export default function useSidebarMenus(game?: Game): MenuItem[] {
  const router = useRouter();

  if (!game) return [];

  const gameId = game?.id;

  return [
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
      label: "Activity Feed",
      path: `/games/${gameId}/feed`,
      icon: <CollectionIcon className="h-6 w-6" />,
      isActive: false,
    },
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
  ].map((menu) => {
    if (!menu) return menu;
    menu.isActive = router.asPath.startsWith(menu.path);
    return menu;
  });
}
