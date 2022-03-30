import {
  Link,
  Variant,
  HoldConfirmationButton,
  Button,
} from '@pavel/components'
import NextLink from 'next/link'
import { withAuthUser, useAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { COMPARISON_LIST, SIGN_UP } from '@pavel/comparator-shared'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Background } from '@pavel/components'
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
          size="none"
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
        size="none"
      >
        Try for free
      </Link>
    </NextLink>
  )
}

const HOW_IT_WORKS_ID = 'how-it-works'
const PRICING_ID = 'pricing'

function LandingHeaderNavigation() {
  return (
    <div className="flex absolute left-1/2 -translate-x-1/2 bottom-[0.8em] invisible md:visible text-base">
      <Button
        variant={Variant.Link}
        onClick={() => {
          document.getElementById(HOW_IT_WORKS_ID).scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
          })
        }}
        className="mx-4 font-semibold"
      >
        How it works
      </Button>
      <Button
        variant={Variant.Link}
        onClick={() => {
          document.getElementById(PRICING_ID).scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
          })
        }}
        className="mx-4 font-semibold"
      >
        Pricing
      </Button>
    </div>
  )
}

export default withAuthUser()(function Index() {
  return (
    <>
      <Background animate />
      <div>
        <Screen className="flex flex-col">
          <LandingHeader animate>
            <HeaderTitle>Socrates</HeaderTitle>
            <LandingHeaderNavigation />
            <HeaderAuth />
          </LandingHeader>
          <div
            className={classNames(
              styles['Hero'],
              'flex flex-col items-center justify-center h-full text-center',
            )}
          >
            <div className={classNames(styles.Line)}>
              Empower your decisions
            </div>
            <div className={classNames(styles.SubLine, 'hidden xs:block')}>
              {/* {`The best in class tools that help you focus on what's important`} */}
              {/* Eliminate the bias. Focus on the important. */}
              {/* {`Tools that help you to eliminate the bias and focus on what's important`} */}
              {/* {`Tools to eliminate the bias and focus on what's important`} */}
              {/* Take the bias out of your decision making process and make better choices, faster with an AI-powered advisor. */}
              {`AI-powered advisor that let's you take the bias out of your decision making process and make better choices, faster.`}
            </div>
            <div className={classNames(styles.Cta)}>
              <MainCTA />
            </div>
          </div>
        </Screen>
        <Screen
          id={HOW_IT_WORKS_ID}
          className="flex justify-center items-center"
        >
          How it works
        </Screen>
        <Screen id={PRICING_ID} className="flex justify-center items-center">
          <Pricing />
        </Screen>
      </div>
    </>
  )
})

function Screen({ className, ...props }) {
  return <div className={classNames(className, 'h-screen')} {...props} />
}

function Pricing() {
  return <div>Pricing</div>
}
