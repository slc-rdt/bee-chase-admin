import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { ComponentType } from "react";
import { Toaster } from "react-hot-toast";
import Layout from "../components/layouts/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>BeeChase | Mission Impossible</title>
        <meta
          name="description"
          content="Complete your missions in BINUS University!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <RedirectIfUnauthenticated />

      <Toaster />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

const RedirectIfUnauthenticated: ComponentType = () => {
  const router = useRouter();
  const { status } = useSession();

  if (
    status === "unauthenticated" &&
    !router.pathname.startsWith("/auth/login")
  ) {
    router.push("/auth/login");
  } else if (
    status === "authenticated" &&
    router.pathname.startsWith("/auth/login")
  ) {
    router.push("/games");
  }

  return <></>;
};

export default MyApp;
