import { useSession } from "next-auth/react";

interface CanBeInstantiated<T> {
  new (accessToken?: string): T;
}

export default function useService<T>(serviceType: CanBeInstantiated<T>): T {
  const { data } = useSession();
  return new serviceType(data?.user.access_token) as T;
}
