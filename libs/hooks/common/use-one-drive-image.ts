import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useSWR from "swr";
import AuthService from "../../services/auth-service";
import useService from "./use-service";

interface OneDriveTokenApiDto {
  token?: string;
  error?: string;
}

export default function useOneDriveImage(downloadUrl?: string) {
  const { status } = useSession();
  const authService = useService(AuthService);

  const { data, error } = useSWR<string, AxiosError<OneDriveTokenApiDto>>(
    status === "authenticated" ? downloadUrl : null,
    async (url) => {
      const { token } = await authService.getOnedriveToken();

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data["@microsoft.graph.downloadUrl"];
    }
  );

  if (error) {
    console.error(error);
    toast.error(error.response?.data.error ?? error.message, {
      id: "useOneDriveImage",
    });
  }

  return { data, error };
}
