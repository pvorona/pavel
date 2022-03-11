import Link from 'next/link'
import { signOut, signInAnonymously } from '@pavel/comparator-shared'
import { Button } from '@pavel/components'
import { withAuthUser, useAuthUser } from 'next-firebase-auth'

export default withAuthUser()(Status)

function Status() {
  const user = useAuthUser()

  async function tryAnonymously() {
    try {
      await signInAnonymously()
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

  if (user.firebaseUser) {
    const userString = user.firebaseUser.isAnonymous
      ? 'Anonymous'
      : user.firebaseUser.email

    return (
      <>
        <div>Authenticated as {userString}</div>
        <div>ID: {user.id}</div>
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
        <Button onClick={tryAnonymously}>Try without signing up</Button>
      </div>
    </>
  )
}
