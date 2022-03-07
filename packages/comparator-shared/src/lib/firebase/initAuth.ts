import { init } from 'next-firebase-auth'
import { API_SIGN_IN, API_SIGN_OUT, COMPARISON_LIST, SIGN_IN } from '../routes'

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
    // firebaseAuthEmulatorHost: 'localhost:9099',
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'comparator-342612',
        clientEmail:
          'firebase-adminsdk-8x8g3@comparator-342612.iam.gserviceaccount.com',
        // The private key must not be accessible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
          : undefined,
      },
      // databaseURL: 'https://my-example-app.firebaseio.com',
    },
    // Use application default credentials (takes precedence over fireaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: 'AIzaSyAcCrEUxCJ2z9o9LH4WpgQVtpZz18L99_E',
      authDomain: 'comparator-342612.firebaseapp.com',
      projectId: 'comparator-342612',
      storageBucket: 'comparator-342612.appspot.com',
      messagingSenderId: '89512111902',
      appId: '1:89512111902:web:57bac28d6f19b5fd05a30f',
    },
    cookies: {
      name: 'Comparator', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 14 * 60 * 60 * 24 * 1000, // 30 days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: false, // set this to false in local (non-HTTPS) development
      signed: false,
    },
    onVerifyTokenError: err => {
      console.error(err)
    },
    onTokenRefreshError: err => {
      console.error(err)
    },
  })
}
