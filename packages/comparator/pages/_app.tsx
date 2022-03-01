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
      <main className="app h-screen">
        <Component {...pageProps} />
      </main>
    </Provider>
  )
}

export default CustomApp
