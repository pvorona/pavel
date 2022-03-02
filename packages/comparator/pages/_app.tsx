import { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { store, persistor } from '../store'
import { PersistGate } from 'redux-persist/integration/react'

import './styles.css'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Comparator</title>
      </Head>
      <main className="app h-screen">
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </main>
    </Provider>
  )
}

export default CustomApp
