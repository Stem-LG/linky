import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default function App({ Component, pageProps:{session, ...pageProps} }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                ></meta>
            </Head>
            <SessionProvider session={session}>
                <Component {...pageProps} />;
            </SessionProvider>
        </>
    );
}
