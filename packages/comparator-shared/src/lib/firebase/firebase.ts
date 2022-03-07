import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAcCrEUxCJ2z9o9LH4WpgQVtpZz18L99_E',
  authDomain: 'comparator-342612.firebaseapp.com',
  projectId: 'comparator-342612',
  storageBucket: 'comparator-342612.appspot.com',
  messagingSenderId: '89512111902',
  appId: '1:89512111902:web:57bac28d6f19b5fd05a30f',
}

export const app = initializeApp(firebaseConfig)

export const firestore = getFirestore()

export const auth = getAuth()
