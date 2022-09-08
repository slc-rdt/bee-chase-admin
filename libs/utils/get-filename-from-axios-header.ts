import { AxiosResponseHeaders } from "axios";

export default function getFilenameFromAxiosHeader(
  headers: AxiosResponseHeaders
) {
  const header = headers["content-disposition"];
  return header?.includes("filename=") ? header.split("filename=")[1] : "";
}
