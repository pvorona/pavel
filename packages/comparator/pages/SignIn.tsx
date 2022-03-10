import { auth } from '@pavel/comparator-shared'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { EmailPasswordForm, SignInLayout } from '../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'

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

  return (
    <EmailPasswordForm
      onSubmit={onSubmit}
      hint="Please confirm your email and password"
      title="Sign in"
      buttonLabel="Sign in"
    />
  )
}
