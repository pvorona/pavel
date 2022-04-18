import { Link, Variant } from '@pavel/components'
import NextLink from 'next/link'
import { useAuthUser } from 'next-firebase-auth'
import { COMPARISON_LIST, SIGN_UP } from '@pavel/comparator-shared'
import styles from './LandingPage.module.scss'
import classNames from 'classnames'
import { PropsWithChildren, ReactNode } from 'react'

export function Hero() {
  return (
    <div
      className={classNames(
        styles['Hero'],
        'flex flex-col items-center justify-center h-full text-center',
      )}
    >
      <div className={classNames(styles.Line)}>Empower your decisions</div>
      <div className={classNames(styles.SubLine, 'hidden xs:block')}>
        {/* {`The best in class tools that help you focus on what's important`} */}
        {/* Eliminate the bias. Focus on the important. */}
        {/* {`Tools that help you to eliminate the bias and focus on what's important`} */}
        {/* {`Tools to eliminate the bias and focus on what's important`} */}
        {/* Take the bias out of your decision making process and make better choices, faster with an AI-powered advisor. */}
        {/* {`AI-powered comparison advisor that let's you take the bias out of your decision making process and make better choices, faster.`} */}
        {/* {`Comparison advisor that let's you take the bias out of your decision making process and make better choices, faster.`} */}
        {/* {`Comparison assistant that let's you take the bias out of your decision making process and make better choices, faster.`} */}
        {/* {`Socrates is a comparison assistant designed to help you make better choices, faster.`} */}
        {/* {`Socrates is a comparison assistant that helps you make better decisions, faster.`} */}
        {/* {`Socrates is a comparison assistant that helps you make better choices faster.`} */}
        {`Comparison assistant that helps you make better choices faster.`}
        {/* {`Comparison assistant that helps making better choices faster.`} */}
      </div>
      <div className={classNames(styles.Cta)}>
        <MainCTA />
      </div>
    </div>
  )
}

export function Features() {
  return (
    <div style={{}}>
      <div
        style={{
          display: 'flex',
          gap: 36,
          flexWrap: 'wrap',
          width: 1017,
          marginInline: 'auto',
        }}
      >
        <FeatureBlock>Unlimited comparisons</FeatureBlock>
        <FeatureBlock>Real-time persistence and collaboration</FeatureBlock>
        <FeatureBlock>Weighted scores computed cells</FeatureBlock>
        <FeatureBlock>Infinite history of modifications</FeatureBlock>
        <FeatureBlock>Collaborative editing</FeatureBlock>
        <FeatureBlock>Integrations</FeatureBlock>
      </div>
    </div>
  )
}

export function FeatureBlock(props: { children: ReactNode }) {
  return <div className={styles['FeatureBlock']} {...props} />
}

export function StepBlock({ children }: { children: ReactNode }) {
  return <div className="max-w-sm">{children}</div>
}

export function StepTitle({ children }: { children: ReactNode }) {
  return (
    <div className={classNames(styles['StepTitle'], 'text-xl font-bold')}>
      {children}
    </div>
  )
}

export function StepDescription({ children }: { children: ReactNode }) {
  return <div className="mt-4">{children}</div>
}

export function HowItWorks() {
  return (
    <>
      <Features />
      <div className="flex mt-40">
        <StepBlock>
          <StepTitle>Identify the problem at hand</StepTitle>
          <StepDescription>
            Describe what the problem at hand is and highlight important aspects
            of the outcome for each option, so that you can make an informed
            decision.
          </StepDescription>
        </StepBlock>
        <StepBlock>
          <StepTitle>Explore your options</StepTitle>
          <StepDescription>
            The results will show which of the choices is better at particular
            aspects - making it easier to make decisions about what&apos;s best
            for you!
          </StepDescription>
        </StepBlock>
        <StepBlock>
          <StepTitle>Find an answer</StepTitle>
        </StepBlock>
      </div>
    </>
  )
}

export function Pricing() {
  return (
    <div>
      <h2 className="text-5xl">We did the math for you.</h2>
      <div className="mt-3">
        Compare options, find the best one and make an informed decision faster
        with Socrates.
      </div>
    </div>
  )
}

function MainCTA() {
  const { id } = useAuthUser()

  if (id) {
    return (
      <NextLink href={COMPARISON_LIST} passHref>
        <Link
          variant={Variant.Unstyled}
          className={classNames(styles['Neon'])}
          labelProps={{
            className: styles['NeonLabel'],
          }}
          rounded
          size="none"
        >
          Compare now
        </Link>
      </NextLink>
    )
  }

  return (
    <NextLink href={SIGN_UP} passHref>
      <Link
        variant={Variant.Unstyled}
        className={classNames(styles['Neon'])}
        labelProps={{
          className: styles['NeonLabel'],
        }}
        rounded
        size="none"
      >
        Compare now
      </Link>
    </NextLink>
  )
}
