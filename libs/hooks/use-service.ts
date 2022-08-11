import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoginDto from "../dtos/login-dto";

interface CanBeInstantiated<T> {
  new (accessToken?: string): T;
}

export default function useService<T>(serviceType: CanBeInstantiated<T>): T {
  const { data, status } = useSession();
  const [service, setService] = useState(new serviceType());

  useEffect(() => {
    if (status === "authenticated") {
      const user = data.user as LoginDto;
      setService(new serviceType(user.access_token));
    }
  }, [status]);

  return service as T;
}
