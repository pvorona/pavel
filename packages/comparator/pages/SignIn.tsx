import { auth } from '@pavel/comparator-shared'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import { EmailPasswordForm, SignInLayout } from '../modules'

export default function SignInPage() {
  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  )
}

function SignInForm() {
  const router = useRouter()

  function onSubmit({ email, password }: { email: string; password: string }) {
    console.log('sign in', { email, password })

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        console.log({ userCredential, user })
        router.replace('/comparison')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return <EmailPasswordForm onSubmit={onSubmit} label="Sign in" />
}
