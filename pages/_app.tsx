import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { ComponentType } from "react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const NextNProgress = dynamic(() => import("nextjs-progressbar"));
const Layout = dynamic(() => import("../components/layouts/layout"));

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session?: Session | null }>) {
  return (
    <SessionProvider
      session={session}
      basePath={`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`}
    >
      <Head>
        <title>BeeChase | Admin</title>
        <meta
          name="description"
          content="Complete your missions in BINUS University!"
        />
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.ico`}
        />
      </Head>

      <RedirectIfUnauthenticated />

      <Toaster />
      <NextNProgress color="#057AFF" />

      <Layout>
        <Component {...pageProps} />
      </Layout>

      <div id="modal-container"></div>
    </SessionProvider>
  );
}

const RedirectIfUnauthenticated: ComponentType = () => {
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading" || !router.isReady) return null;

  const isLogin = router.pathname.startsWith("/auth/login");
  if (status === "unauthenticated" && !isLogin) {
    router.push("/auth/login");
  } else if (status === "authenticated" && isLogin) {
    router.push("/games");
  }

  return null;
};

export default MyApp;
