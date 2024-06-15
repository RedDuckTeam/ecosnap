import Providers from '@/providers/Providers';

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Layout } from '@/components/layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Trash Finance</title>
        <meta name="description" content="Trash Finance" />
        <meta name="application-name" content="" />
        <meta name="generator" content="Next.js" />
        <meta name="keywords" content="Trash Finance" />
        <meta name="color-scheme" content="light" />
        <meta name="creator" content="Trash Finance" />
        <meta name="publisher" content="Trash Finance" />
      </Head>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </>
  );
}
