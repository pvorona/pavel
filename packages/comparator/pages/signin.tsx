import { auth, SIGN_UP } from '@pavel/comparator-shared'
import { signInWithEmailAndPassword } from 'firebase/auth'
import {
  EmailPasswordForm,
  SignInLayout,
  emailStorageKey,
  emailStorage,
  useTryAnonymously,
} from '../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { Button, Link, Variant } from '@pavel/components'
import NextLink from 'next/link'
import { useCallback } from 'react'
import { LoadingStatus } from '@pavel/types'
import { removeFromStorage } from '@pavel/utils'

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

const removeEmailFromStorage = () => {
  removeFromStorage(emailStorageKey, emailStorage)
}

function SignInForm() {
  const { tryAnonymously, status } = useTryAnonymously({
    onSuccess: removeEmailFromStorage,
  })

  function onSubmit({ email, password }: { email: string; password: string }) {
    return signInWithEmailAndPassword(auth, email, password)
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
      <div className="text-center mt-12 text-gray-1">
        {"Don't have an account?"}
      </div>
      <div className="text-center mt-1 text-gray-1">
        <NextLink href={SIGN_UP} passHref>
          <Link>Sign up</Link>
        </NextLink>{' '}
        or{' '}
        <Button
          variant={Variant.Link}
          onClick={tryAnonymously}
          loadingStatus={status}
          disabled={status === LoadingStatus.IN_PROGRESS}
        >
          try anonymously
        </Button>
      </div>
    </>
  )
}
