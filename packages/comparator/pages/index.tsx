import {
  Link,
  Variant,
  HoldConfirmationButton,
  Button,
  ParallaxContainer,
  ParallaxLayer,
  ParallaxPage,
} from '@pavel/components'
import NextLink from 'next/link'
import { withAuthUser, useAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import {
  COMPARISON_LIST,
  signOut,
  SIGN_IN,
  SIGN_UP,
} from '@pavel/comparator-shared'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Background } from './Background'
import { PropsWithChildren } from 'react'

const CTAStyles = {
  borderRadius: 30,
}

export const getServerSideProps = withAuthUserSSR()()

function AuthSection() {
  const { id } = useAuthUser()

  if (id) {
    return (
      <Button
        onClick={signOut}
        variant={Variant.Filled}
        className="ml-4"
        size="sm"
        style={{
          ...CTAStyles,
        }}
      >
        Sign out
      </Button>
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
}

function MainCTA() {
  const { id } = useAuthUser()

  if (id) {
    return (
      <NextLink href={COMPARISON_LIST} passHref>
        <Link
          variant={Variant.Unstyled}
          className={classNames(styles['Neon'], 'shadow')}
          labelClassName={styles['NeonLabel']}
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
        variant={Variant.Unstyled}
        className={classNames(styles['Neon'], 'shadow')}
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
}

function Header() {
  return (
    <div
      className={classNames(
        'flex justify-between my-2 mx-4 md:my-4 md:mx-8 lg:my-6 lg:mx-14 items-center relative whitespace-nowrap',
        styles['Header'],
      )}
    >
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
        <AuthSection />
      </div>
    </div>
  )
}

export default withAuthUser()(function Index() {
  return (
    <ParallaxContainer>
      <ParallaxLayer depth={1}>
        <Background />
      </ParallaxLayer>
      <ParallaxLayer depth={0}>
        <ParallaxPage className="flex flex-col">
          <Header />
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
                'text-xl font-medium invisible xs:visible',
              )}
            >
              {`The best in class tools that help you focus on what's important`}
              {/* {`Tools and models that help you see the important`} */}
              {/* Eliminate the bias. Focus on important outcomes. */}
            </div>
            <div className={classNames(styles.Cta)}>
              <MainCTA />
            </div>
            <HoldConfirmationButton />
          </div>
        </ParallaxPage>
        <ParallaxPage className="flex justify-center items-center">
          How it works
        </ParallaxPage>
      </ParallaxLayer>
    </ParallaxContainer>
  )
})
