import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <html data-theme="cupcake" />
        <title>BinusChase | Mission Impossible</title>
        <meta
          name="description"
          content="Complete your missions in BINUS University!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
