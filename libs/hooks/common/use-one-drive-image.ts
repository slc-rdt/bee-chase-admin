import axios from "axios";
import toast from "react-hot-toast";
import useSWR from "swr";
import useOneDriveToken from "./use-one-drive-token";

export default function useOneDriveImage(downloadUrl?: string) {
  const onedriveToken = useOneDriveToken();

  const { data, error } = useSWR(
    onedriveToken ? downloadUrl : null,
    async (url) => {
      if (!onedriveToken) return null;

      const { token } = onedriveToken;

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
