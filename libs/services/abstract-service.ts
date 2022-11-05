import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import getFilenameFromAxiosHeader from "../utils/get-filename-from-axios-header";

export default abstract class AbstractService {
  protected axios: AxiosInstance;

  constructor(protected accessToken?: string) {
    const axiosConfig: AxiosRequestConfig = accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {};

    this.axios = axios.create(axiosConfig);
  }

  protected get apiUrl(): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}/backend`;
  }

  protected async getBlob(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<[string, Blob]> {
    const { headers, data } = await this.axios.get<Blob>(url, {
      ...(config ?? {}),
      responseType: "blob",
    });
    const filename = getFilenameFromAxiosHeader(headers);
    return [filename, data];
  }
}
