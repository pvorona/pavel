import { auth } from '@pavel/comparator-shared'
import { createUserWithEmailAndPassword } from 'firebase/auth'
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

  return (
    <EmailPasswordForm
      onSubmit={onSubmit}
      title="Sign up"
      hint="Please enter your email and password"
      buttonLabel="Sign up"
    />
  )
}
