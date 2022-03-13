import { auth, signInAnonymously, SIGN_IN } from '@pavel/comparator-shared'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { EmailPasswordForm, SignInLayout } from '../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { Button, Link } from '@pavel/components'
import NextLink from 'next/link'

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignUpPage)

function SignUpPage() {
  return (
    <SignInLayout>
      <SignUpForm />
    </SignInLayout>
  )
}

function SignUpForm() {
  function onSubmit({ email, password }: { email: string; password: string }) {
    return createUserWithEmailAndPassword(auth, email, password)
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
        title="Sign up"
        hint="Please enter your email and create password"
        buttonLabel="Sign up"
        buttonLoadingLabel="Loading..."
      />
      <div className="text-center mt-12 text-gray-1">
        Already have an account?
      </div>
      <div className="text-center mt-1 text-gray-1 tracking-wide">
        <NextLink href={SIGN_IN} passHref>
          <Link>Sign in</Link>
        </NextLink>{' '}
        or{' '}
        <Button variant="link" onClick={tryAnonymously}>
          try anonymously
        </Button>
      </div>
    </>
  )
}
