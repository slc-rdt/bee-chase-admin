import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="winter">
      <Head>
        <title>BeeChase | Mission Impossible</title>
        <meta
          name="description"
          content="Complete your missions in BINUS University!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
