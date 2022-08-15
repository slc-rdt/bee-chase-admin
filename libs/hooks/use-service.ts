import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface CanBeInstantiated<T> {
  new (accessToken?: string): T;
}

export default function useService<T>(serviceType: CanBeInstantiated<T>): T {
  const { data, status } = useSession();
  const [service, setService] = useState(new serviceType());

  useEffect(() => {
    if (status === "authenticated") {
      const user = data.user;
      if (user.access_token) {
        setService(new serviceType(user.access_token));
      }
    }
  }, [data?.user, serviceType, status]);

  return service as T;
}
