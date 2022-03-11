import { auth, signInAnonymously, SIGN_UP } from '@pavel/comparator-shared'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { EmailPasswordForm, SignInLayout } from '../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { Button } from '@pavel/components'
import Link from 'next/link'

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignInPage)

function SignInPage() {
  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  )
}

function SignInForm() {
  function onSubmit({ email, password }: { email: string; password: string }) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function tryAnonymously() {
    try {
      await signInAnonymously()
    } catch (error) {
      console.error('Failed to sign in anonymously', error)
    }
  }

  return (
    <>
      <EmailPasswordForm
        onSubmit={onSubmit}
        hint="Please confirm your email and password"
        title="Sign in"
        buttonLabel="Sign in"
        buttonLoadingLabel="Loading..."
      />
      <div className="text-center mt-9 text-gray-1">
        {"Don't have an account yet?"}
      </div>
      <div className="text-center mt-1 text-gray-1">
        <Link href={SIGN_UP} passHref>
          <Button component="a" variant="link">
            Sign up
          </Button>
        </Link>{' '}
        or{' '}
        <Button variant="link" onClick={tryAnonymously}>
          try without signing up
        </Button>
      </div>
    </>
  )
}
