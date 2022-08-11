import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoginDto from "../dtos/login-dto";

export default function useUser() {
  const router = useRouter();
  const { data, status } = useSession();
  const [user, setUser] = useState<LoginDto | null>(null);

  if (status === "unauthenticated") router.push("/auth/login");

  useEffect(() => {
    if (status === "authenticated") {
      setUser(data.user as LoginDto);
    }
  }, [status]);

  return user;
}
