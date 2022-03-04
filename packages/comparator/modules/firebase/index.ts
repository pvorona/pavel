// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAcCrEUxCJ2z9o9LH4WpgQVtpZz18L99_E',
  authDomain: 'comparator-342612.firebaseapp.com',
  projectId: 'comparator-342612',
  storageBucket: 'comparator-342612.appspot.com',
  messagingSenderId: '89512111902',
  appId: '1:89512111902:web:57bac28d6f19b5fd05a30f',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

export const firestore = getFirestore()
