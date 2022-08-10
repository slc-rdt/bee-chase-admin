import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import useService from "../../../libs/hooks/useService";
import AuthService from "../../../libs/services/auth-service";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
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

        const user = await authService.login({
          email: credentials?.username ?? "",
          password: credentials?.password ?? "",
        });

        // Add logic here to look up the user from the credentials supplied
        // const user = { id: 1, name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore https://github.com/nextauthjs/next-auth/discussions/2762#discussioncomment-1332952
      session.user = token.user;
      return session;
    },
  },
});
