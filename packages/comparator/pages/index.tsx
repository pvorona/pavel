import { Link, Variant } from '@pavel/components'
import NextLink from 'next/link'
import { withAuthUser, useAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { COMPARISON_LIST, SIGN_IN, SIGN_UP } from '@pavel/comparator-shared'
import styles from './index.module.scss'
import classNames from 'classnames'

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
          style={{
            ...CTAStyles,
            width: 235,
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
        <div className="flex justify-between py-6 px-14 items-baseline">
          <div className="text-4xl font-medium">Socrates</div>
          <div className="flex">
            <Link href="/" className="mx-4 font-semibold">
              Product
            </Link>
            <Link href="/" className="mx-4 font-semibold">
              Pricing
            </Link>
            <Link href="/" className="mx-4 font-semibold">
              Demo
            </Link>
          </div>
          <div>
            <AuthSection userId={user.id} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="max-w-5xl">
            <div
              className={classNames(
                styles.Line,
                'text-8xl font-semibold animate-bounce',
              )}
            >
              Empower your decisions with AI
            </div>
            <div
              className={classNames(
                styles.SubLine,
                'text-xl font-medium text-[#425466] mt-8',
              )}
            >
              {`The best in class tools that help you focus on what's important`}
            </div>
            <div className={classNames(styles.SubLine, 'mt-8')}>
              <MainCTA userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

const circleClass =
  'opacity-40 blur-md hover:opacity-40 hover:scale-2 transition-all duration-400'

function Background() {
  return (
    <svg
      width="100%"
      height="100%"
      className="fixed top-0 right-0 bottom-0 left-0"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(270, 81%, 65%)">
            <animate
              attributeName="stop-color"
              values="hsl(270, 81%, 65%); hsl(357, 81%, 65%); hsl(270, 81%, 65%)"
              dur="4s"
              repeatCount="indefinite"
            ></animate>
          </stop>

          <stop offset="100%" stopColor="hsl(357, 81%, 65%)">
            <animate
              attributeName="stop-color"
              values="hsl(357, 81%, 65%); hsl(270, 81%, 65%); hsl(357, 81%, 65%)"
              dur="4s"
              repeatCount="indefinite"
            ></animate>
          </stop>
        </linearGradient>
      </defs>
      <circle
        cx="95%"
        cy="95%"
        r="40%"
        fill="url(#logo-gradient)"
        className={circleClass}
      ></circle>
      <circle
        cx="81%"
        cy="0"
        r="5%"
        fill="url(#logo-gradient)"
        className={circleClass}
      ></circle>
      <circle
        cx="105%"
        cy="5%"
        r="20%"
        fill="url(#logo-gradient)"
        className={circleClass}
      ></circle>
      <circle
        cx="81%"
        cy="26%"
        r="10%"
        fill="url(#logo-gradient)"
        className={circleClass}
      ></circle>
    </svg>
  )
}
