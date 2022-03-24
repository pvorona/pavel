import {
  Link,
  Variant,
  HoldConfirmationButton,
  ParallaxContainer,
  ParallaxLayer,
  ParallaxPage,
} from '@pavel/components'
import NextLink from 'next/link'
import { withAuthUser, useAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { COMPARISON_LIST, SIGN_UP } from '@pavel/comparator-shared'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Background } from './Background'
import { HeaderAuth, HeaderTitle, LandingHeader } from '../modules'

export const getServerSideProps = withAuthUserSSR()()

function MainCTA() {
  const { id } = useAuthUser()

  if (id) {
    return (
      <NextLink href={COMPARISON_LIST} passHref>
        <Link
          variant={Variant.Unstyled}
          className={classNames(styles['Neon'], 'shadow')}
          labelClassName={styles['NeonLabel']}
          rounded
          style={{
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
        rounded
        style={{
          width: 235,
        }}
      >
        Try for free
      </Link>
    </NextLink>
  )
}

function LandingHeaderNavigation() {
  return (
    <div className="flex absolute left-1/2 -translate-x-1/2 bottom-[0.8em] invisible md:visible text-base">
      <Link href="/" className="mx-4 font-semibold">
        How it works
      </Link>
      <Link href="/" className="mx-4 font-semibold">
        Pricing
      </Link>
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
          <LandingHeader>
            <HeaderTitle>Socrates</HeaderTitle>
            <LandingHeaderNavigation />
            <HeaderAuth />
          </LandingHeader>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={classNames(styles.Line)}>
              Empower your decisions
            </div>
            <div className={classNames(styles.SubLine, 'hidden xs:block')}>
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
