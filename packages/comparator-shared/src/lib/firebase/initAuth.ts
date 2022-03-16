import { ensureString } from '@pavel/assert'
import { init } from 'next-firebase-auth'
import { API_SIGN_IN, API_SIGN_OUT, COMPARISON_LIST, SIGN_IN } from '../routes'

const EXPIRATION_TIME = 14 * 60 * 60 * 24 * 1000

export const initAuth = () => {
  init({
    authPageURL: SIGN_IN,
    appPageURL: COMPARISON_LIST,
    loginAPIEndpoint: API_SIGN_IN,
    logoutAPIEndpoint: API_SIGN_OUT,
    onLoginRequestError: err => {
      console.error(err)
    },
    onLogoutRequestError: err => {
      console.error(err)
    },
    firebaseAdminInitConfig: {
      credential: {
        projectId: ensureString(
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        ),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
          ? ensureString(
              process.env.FIREBASE_CLIENT_EMAIL,
              'FIREBASE_CLIENT_EMAIL',
            )
          : undefined,
        // The private key must not be accessible on the client
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
          : undefined,
      },
    },
    // Use application default credentials (takes precedence over fireaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: ensureString(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        'NEXT_PUBLIC_FIREBASE_API_KEY',
      ),
      authDomain: ensureString(
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      ),
      projectId: ensureString(
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      ),
      storageBucket: ensureString(
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      ),
      messagingSenderId: ensureString(
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      ),
      appId: ensureString(
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        'NEXT_PUBLIC_FIREBASE_APP_ID',
      ),
    },
    cookies: {
      name: 'Comparator',
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: EXPIRATION_TIME,
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: false,
      signed: true,
    },
    onVerifyTokenError: err => {
      console.error(err)
    },
    onTokenRefreshError: err => {
      console.error(err)
    },
  })
}
