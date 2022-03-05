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
      <Component {...pageProps} />
    </Provider>
  )
}

export default CustomApp
