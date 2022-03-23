import { auth, signInAnonymously, SIGN_IN } from '@pavel/comparator-shared'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  EmailPasswordForm,
  SignInLayout,
  emailStorageKey,
  emailStorage,
} from '../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { Button, Link, Variant } from '@pavel/components'
import NextLink from 'next/link'
import { removeFromStorage } from '@pavel/utils'
import { useState } from 'react'
import { LoadingStatus } from '@pavel/types'

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
  const [isLoading, setIsLoading] = useState(false)

  function onSubmit({ email, password }: { email: string; password: string }) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  async function tryAnonymously() {
    setIsLoading(true)
    try {
      await signInAnonymously()
      removeFromStorage(emailStorageKey, emailStorage)
    } catch (error) {
      console.error('Failed to sign in anonymously', error)
    } finally {
      setIsLoading(false)
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
        <Button
          variant={Variant.Link}
          onClick={tryAnonymously}
          loadingStatus={
            isLoading ? LoadingStatus.IN_PROGRESS : LoadingStatus.IDLE
          }
          disabled={isLoading}
        >
          try anonymously
        </Button>
      </div>
    </>
  )
}
