import { Variant, Button } from '@pavel/components'
import { withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import classNames from 'classnames'
import { Background } from '@pavel/components'
import {
  HeaderAuth,
  HeaderTitle,
  Hero,
  HowItWorks,
  LandingHeader,
  Pricing,
} from '../modules'
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { usePrefersColorScheme } from '@pavel/react-utils'

export const getServerSideProps = withAuthUserSSR()()

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

export default withAuthUser()(function LandingPage() {
  const isDark = usePrefersColorScheme()
  useEffect(() => {
    if (!isDark) {
      return
    }

    document.body.style.setProperty(
      '--background',
      'var(--background-dark-landing)',
    )

    return () => {
      document.body.style.removeProperty('--background')
    }
  }, [isDark])

  return (
    <>
      <Background animate />
      <div>
        <Screen className="flex flex-col">
          <LandingHeader animate>
            <HeaderTitle>Socrates</HeaderTitle>
            <HeaderAuth />
          </LandingHeader>
          <Hero />
        </Screen>
      </div>
    </>
  )
})

function Screen({
  className,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLDivElement>, HTMLDivElement>
>) {
  return <div className={classNames(className, 'h-screen')} {...props} />
}
