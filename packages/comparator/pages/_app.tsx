import { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { store } from '../store'

import './styles.css'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Comparator</title>
      </Head>
      <main className="app h-screen  dark:bg-[#202124] dark:text-[#e7eaed] selection:bg-black selection:text-white dark:selection:bg-gray-3">
        <Component {...pageProps} />
      </main>
    </Provider>
  )
}

export default CustomApp
