import { auth, SIGN_IN } from '@pavel/comparator-shared'
import { createUserWithEmailAndPassword } from 'firebase/auth'
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
import { removeFromStorage } from '@pavel/utils'
import { useCallback } from 'react'
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

const removeEmailFromStorage = () => {
  removeFromStorage(emailStorageKey, emailStorage)
}

function SignUpForm() {
  const { tryAnonymously, status } = useTryAnonymously({
    onSuccess: removeEmailFromStorage,
  })

  function onSubmit({ email, password }: { email: string; password: string }) {
    return createUserWithEmailAndPassword(auth, email, password)
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
          loadingStatus={status}
          disabled={status === LoadingStatus.IN_PROGRESS}
        >
          try anonymously
        </Button>
      </div>
    </>
  )
}
