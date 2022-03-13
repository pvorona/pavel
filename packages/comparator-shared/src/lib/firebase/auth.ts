import { signInAnonymously as signInAnonymouslyOriginal } from 'firebase/auth'
import { auth } from './firebase'

export function signOut() {
  return auth.signOut()
}

export function signInAnonymously() {
  return signInAnonymouslyOriginal(auth)
}
