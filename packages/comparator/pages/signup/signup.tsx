import { auth, SIGN_IN } from '@pavel/comparator-shared'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  EmailPasswordForm,
  SignInLayout,
  EMAIL_STORAGE_KEY,
  EMAIL_STORAGE,
  useTryAnonymously,
} from '../../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { Button, Link, Variant } from '@pavel/components'
import NextLink from 'next/link'
import { removeFromStorage } from '@pavel/utils'
import { LoadingStatus } from '@pavel/types'
import styles from './SignUp.module.scss'
import classNames from 'classnames'

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
  removeFromStorage(EMAIL_STORAGE_KEY, EMAIL_STORAGE)
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
        hint="Enter your email and create password"
        buttonLabel="Sign up"
        buttonLoadingLabel="Loading..."
      />
      <div className={classNames('text-center mt-12', styles['Text'])}>
        Already have an account?
      </div>
      <div
        className={classNames('text-center mt-1 tracking-wide', styles['Text'])}
      >
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
