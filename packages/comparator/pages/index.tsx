import { Link, Variant } from '@pavel/components'
import NextLink from 'next/link'
import { withAuthUser, useAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { COMPARISON_LIST, SIGN_IN, SIGN_UP } from '@pavel/comparator-shared'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Background } from './Background'

const CTAStyles = {
  borderRadius: 30,
}

export const getServerSideProps = withAuthUserSSR()()

const AuthSection = withAuthUser<{ userId: string }>()(function AuthSection({
  userId,
}) {
  if (userId) {
    return (
      <NextLink href={COMPARISON_LIST} passHref>
        <Link
          variant={Variant.Outlined}
          className="ml-4"
          size="sm"
          style={{
            ...CTAStyles,
          }}
        >
          Go to app
        </Link>
      </NextLink>
    )
  }

  return (
    <>
      <NextLink href={SIGN_IN} passHref>
        <Link
          style={{
            ...CTAStyles,
          }}
          size="sm"
          variant={Variant.Outlined}
        >
          Sign in
        </Link>
      </NextLink>
      <NextLink href={SIGN_UP} passHref>
        <Link
          variant={Variant.Filled}
          className="ml-4"
          size="sm"
          style={{
            ...CTAStyles,
          }}
        >
          Sign up
        </Link>
      </NextLink>
    </>
  )
})

const MainCTA = withAuthUser<{
  userId: string
}>({})(function MainCTA({ userId }) {
  if (userId) {
    return (
      <NextLink href={COMPARISON_LIST} passHref>
        <Link
          variant={Variant.Filled}
          className={styles['Neon']}
          style={{
            ...CTAStyles,
            width: 200,
          }}
        >
          Go to app
        </Link>
      </NextLink>
    )
  }

  return (
    <NextLink href={SIGN_UP} passHref>
      <Link
        variant={Variant.Filled}
        className={styles['Neon']}
        labelClassName={styles['NeonLabel']}
        style={{
          ...CTAStyles,
          width: 235,
        }}
      >
        Try for free
      </Link>
    </NextLink>
  )
})

export default withAuthUser()(function Index() {
  const user = useAuthUser()

  return (
    <>
      <Background />
      <div className="flex flex-col h-full">
        <div className="flex justify-between my-2 mx-4 md:my-4 md:mx-8 lg:my-6 lg:mx-14 items-center relative whitespace-nowrap">
          <div className="text-4xl font-medium">Socrates</div>
          <div className="flex absolute left-1/2 -translate-x-1/2 bottom-2 invisible md:visible">
            <Link href="/" className="mx-4 font-semibold">
              How it works
            </Link>
            <Link href="/" className="mx-4 font-semibold">
              Pricing
            </Link>
          </div>
          <div className="invisible xs:visible">
            <AuthSection userId={user.id} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div
            className={classNames(
              styles.Line,
              'text-8xl font-semibold animate-bounce',
            )}
          >
            Empower your decisions
          </div>
          <div
            className={classNames(
              styles.SubLine,
              'text-xl font-medium text-gray-main-45 invisible xs:visible',
            )}
          >
            {`The best in class tools that help you focus on what's important`}
            {/* {`Tools and models that help you see the important`} */}
            {/* Eliminate the bias. Focus on important outcomes. */}
          </div>
          <div className={classNames(styles.SubLine)}>
            <MainCTA userId={user.id} />
          </div>
        </div>
      </div>
    </>
  )
})

// function Background() {
//   return (
//     <div
//       className="fixed top-0 bottom-0 right-0 left-0 -z-10"
//       style={{
//         backgroundSize: '100vw 175vh',
//         backgroundImage: `url(${img.src})`,
//       }}
//     />
//   )
// }
