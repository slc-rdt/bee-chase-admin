import {
  CameraIcon as OutlineCameraIcon,
  ChartBarIcon as OutlineChartBarIcon,
  ClipboardIcon as OutlineClipboardIcon,
  ClockIcon as OutlineClockIcon,
  FlagIcon as OutlineFlagIcon,
  RectangleStackIcon as OutlineRectangleStackIcon,
  UserGroupIcon as OutlineUserGroupIcon,
  UsersIcon as OutlineUsersIcon,
  ShieldCheckIcon as OutlineShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  CameraIcon as SolidCameraIcon,
  ChartBarIcon as SolidChartBarIcon,
  ClipboardIcon as SolidClipboardIcon,
  ClockIcon as SolidClockIcon,
  FlagIcon as SolidFlagIcon,
  RectangleStackIcon as SolidRectangleStackIcon,
  UserGroupIcon as SolidUserGroupIcon,
  UsersIcon as SolidUsersIcon,
  ShieldCheckIcon as SolidShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Game from "../../models/game";

interface IMenu {
  label: string;
  path: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  isActive: boolean;
}

type MenuItem = IMenu | null;

export default function useSidebarMenus(game?: Game): MenuItem[] {
  const router = useRouter();

  const fullscreenRoutes = ["/verifications/[missionId]"];
  const currentRouteMustBeFullscreen = fullscreenRoutes.some((route) =>
    router.pathname.includes(route)
  );

  if (!game || currentRouteMustBeFullscreen) {
    return [];
  }

  const gameId = game?.id;

  return [
    {
      label: "Details",
      path: `/games/${gameId}/edit`,
      icon: <OutlineClipboardIcon className="h-6 w-6" />,
      activeIcon: <SolidClipboardIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Missions",
      path: `/games/${gameId}/missions`,
      icon: <OutlineFlagIcon className="h-6 w-6" />,
      activeIcon: <SolidFlagIcon className="h-6 w-6" />,
      isActive: false,
    },
    // {
    //   label: "Automations",
    //   path: `/games/${gameId}/automations`,
    //   icon: <OutlineFilmIcon className="h-6 w-6" />,
    //   activeIcon: <SolidFilmIcon className="h-6 w-6" />,
    //   isActive: false,
    // },
    {
      label: "Participants",
      path: `/games/${gameId}/participants`,
      icon: <OutlineUserGroupIcon className="h-6 w-6" />,
      activeIcon: <SolidUserGroupIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Start & End",
      path: `/games/${gameId}/start-end`,
      icon: <OutlineClockIcon className="h-6 w-6" />,
      activeIcon: <SolidClockIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Admins",
      path: `/games/${gameId}/admins`,
      icon: <OutlineUsersIcon className="h-6 w-6" />,
      activeIcon: <SolidUsersIcon className="h-6 w-6" />,
      isActive: false,
    },
    // {
    //   label: "Verifications",
    //   path: `/games/${gameId}/verifications`,
    //   icon: <OutlineShieldCheckIcon className="h-6 w-6" />,
    //   activeIcon: <SolidShieldCheckIcon className="h-6 w-6" />,
    //   isActive: false,
    // },

    null,

    {
      label: "Activity Feed",
      path: `/games/${gameId}/feed`,
      icon: <OutlineRectangleStackIcon className="h-6 w-6" />,
      activeIcon: <SolidRectangleStackIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Leaderboard",
      path: `/games/${gameId}/leaderboard`,
      icon: <OutlineChartBarIcon className="h-6 w-6" />,
      activeIcon: <SolidChartBarIcon className="h-6 w-6" />,
      isActive: false,
    },
    {
      label: "Submissions",
      path: `/games/${gameId}/submissions`,
      icon: <OutlineCameraIcon className="h-6 w-6" />,
      activeIcon: <SolidCameraIcon className="h-6 w-6" />,
      isActive: false,
    },
  ].map((menu) => {
    if (!menu) return menu;
    menu.isActive = router.asPath.startsWith(menu.path);
    return menu;
  });
}
