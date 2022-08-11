import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import useService from "../../../libs/hooks/useService";
import AuthService from "../../../libs/services/auth-service";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, _req) {
        const authService = useService(AuthService);

        return await authService.login({
          username: credentials?.username ?? "",
          password: credentials?.password ?? "",
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore https://github.com/nextauthjs/next-auth/discussions/2762#discussioncomment-1332952
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
  },
});
