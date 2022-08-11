import axios, { AxiosInstance } from "axios";

export default abstract class AbstractService {
  protected axios: AxiosInstance;

  constructor(protected accessToken?: string) {
    const axiosConfig = accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {};

    this.axios = axios.create(axiosConfig);
  }

  protected get apiUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL;
  }
}
