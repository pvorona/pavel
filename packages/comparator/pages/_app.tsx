import { AppProps } from 'next/app'
import Head from 'next/head'
import './styles.css'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Comparator</title>
      </Head>
      <main className="app h-screen">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default CustomApp
