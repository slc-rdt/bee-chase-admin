import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useSWR from "swr";
import AuthService from "../../services/auth-service";
import useService from "./use-service";

export default function useOneDriveToken() {
  const { status } = useSession();
  const authService = useService(AuthService);

  const { data, error } = useSWR(
    status === "authenticated" ? "onedrive-token" : null,
    async () => await authService.getOnedriveToken()
  );

  if (error) {
    console.error(error);
    toast.error(error.response?.data.error ?? error.message, {
      id: "useOneDriveToken",
    });
  }

  return data;
}
