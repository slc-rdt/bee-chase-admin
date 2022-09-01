import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import useSWR from "swr";

interface OneDriveTokenApiDto {
  token?: string;
  error?: string;
}

export default function useOneDriveImage(downloadUrl?: string) {
  const { data, error } = useSWR<string, AxiosError<OneDriveTokenApiDto>>(
    downloadUrl ?? null,
    async (url) => {
      const { data } = await axios
        .get<OneDriveTokenApiDto>(
          `${process.env.NEXT_PUBLIC_APP_URL}/bluejack/Account/GetOneDriveToken`
        )
        .then((resp) =>
          axios.get(url, {
            headers: {
              Authorization: `Bearer ${resp.data.token}`,
            },
          })
        );

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
