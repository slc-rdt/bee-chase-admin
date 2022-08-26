import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { ComponentType } from "react";
import { Toaster } from "react-hot-toast";
import Layout from "../components/layouts/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session} basePath="/beechase-admin/api/auth">
      <Head>
        <title>BeeChase | Admin</title>
        <meta
          name="description"
          content="Complete your missions in BINUS University!"
        />
        <link rel="icon" href="/beechase-admin/favicon.ico" />
      </Head>

      <RedirectIfUnauthenticated />

      <Toaster />
      <NextNProgress color="#057AFF" />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

const RedirectIfUnauthenticated: ComponentType = () => {
  const router = useRouter();
  const { status } = useSession();

  const isLogin = router.pathname.startsWith("/auth/login");
  if (status === "unauthenticated" && !isLogin) {
    router.push("/auth/login");
  } else if (status === "authenticated" && isLogin) {
    router.push("/games");
  }

  return null;
};

export default MyApp;
