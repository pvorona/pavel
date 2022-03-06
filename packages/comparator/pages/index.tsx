import Link from 'next/link'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '@pavel/comparator-shared'
import { Button } from '@pavel/components'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectAuthState, useAuth } from '../modules'
import { signOut } from '../modules/auth/auth.firebase'

export default function Index() {
  useAuth()

  const router = useRouter()
  const user = useSelector(selectAuthState)

  async function tryAnonymously() {
    try {
      await signInAnonymously(auth)
      router.push('/comparison')
    } catch (error) {
      console.error('Failed to sign in anonymously', error)
    }
  }

  async function onSignOut() {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out', error)
    }
  }

  console.log({ user })

  const userString = user.isAnonymous ? 'Anonymously' : user.email

  if (user) {
    return (
      <>
        Authenticated {userString}
        <Button onClick={onSignOut}>Sign out</Button>
      </>
    )
  }

  return (
    <>
      <div>
        <Link href="/signup">Sign up</Link>
      </div>
      <div>
        <Link href="/signin">Sign in</Link>
      </div>
      <div>
        <Button onClick={tryAnonymously}>Try without signing in</Button>
      </div>
    </>
  )
}
