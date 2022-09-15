import { SessionProvider, useSession } from "next-auth/react";
import App, { AppContext, AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { ComponentType } from "react";
import { Toaster } from "react-hot-toast";
import { currentlyViewedGameContext } from "../libs/contexts/currently-viewed-game-context";
import GameService from "../libs/services/game-service";
import createServerSideService from "../libs/utils/create-server-side-service";
import "../styles/globals.css";

const NextNProgress = dynamic(() => import("nextjs-progressbar"));
const Layout = dynamic(() => import("../components/layouts/layout"));

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
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

      <currentlyViewedGameContext.Provider
        value={pageProps.currentlyViewedGame}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </currentlyViewedGameContext.Provider>

      <div id="modal-container"></div>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const context = appContext.ctx;
  const gameService = await createServerSideService(
    context.req as any,
    GameService
  );
  const isGameDetail = context.pathname.startsWith("/games/[gameId]");
  const gameId = context.query.gameId;
  const game = isGameDetail ? await gameService.getOneById(`${gameId}`) : null;

  appProps.pageProps.currentlyViewedGame = game;

  return { ...appProps };
};

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
