import "next-auth";
import "next-auth/jwt";
import { DefaultJWT } from "next-auth/jwt";
import User from "../dtos/login-dto";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    user: User;
  }
}
