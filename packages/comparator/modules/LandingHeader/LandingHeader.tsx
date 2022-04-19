import { signOut, SIGN_IN, SIGN_UP } from '@pavel/comparator-shared'
import { Button, Variant, Link } from '@pavel/components'
import { useHasMounted, usePrefersColorScheme } from '@pavel/react-utils'
import classNames from 'classnames'
import { useAuthUser } from 'next-firebase-auth'
import NextLink from 'next/link'
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import styles from './LandingHeader.module.scss'

function AuthSection() {
  const { id } = useAuthUser()
  const isDark = usePrefersColorScheme()
  const hasMounted = useHasMounted()
  const globalBackground =
    isDark && hasMounted ? 'hsl(var(--c-1-20))' : undefined

  if (id) {
    return (
      <Button
        onClick={signOut}
        variant={Variant.Outlined}
        size="sm"
        rounded
        style={{
          '--background-dark-hover': 'hsl(var(--c-1-30))',
          '--global-background': globalBackground,
          '--outline-color-dark': 'hsl(var(--c-1-50))',
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
          rounded
          size="sm"
          variant={Variant.Outlined}
          style={{
            '--background-dark-hover': 'hsl(var(--c-1-30))',
            '--global-background': globalBackground,
            '--outline-color-dark': 'hsl(var(--c-1-40))',
          }}
        >
          Sign in
        </Link>
      </NextLink>
      <NextLink href={SIGN_UP} passHref>
        <Link
          variant={Variant.Filled}
          className="ml-4"
          size="sm"
          rounded
          style={{
            '--background-dark-default': 'hsl(var(--c-1-15))',
            '--background-dark-hover': 'hsl(var(--c-1-10))',
            '--global-background': globalBackground,
            '--outline-color-dark': 'hsl(var(--c-1-40))',
          }}
        >
          Sign up
        </Link>
      </NextLink>
    </>
  )
}

type LandingHeaderProps = PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    animate?: boolean
  }
>

export function LandingHeader({
  children,
  animate,
  ...props
}: LandingHeaderProps) {
  return (
    <div
      className={classNames(
        'flex justify-between items-baseline relative whitespace-nowrap',
        [styles['Header']],
        { [styles['Animated']]: animate },
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type TitleProps = PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>

export function HeaderTitle({ className, ...props }: TitleProps) {
  return (
    <div className={classNames(className, 'text-4xl font-medium')} {...props} />
  )
}

export function HeaderAuth() {
  return (
    <div className="invisible xs:visible">
      <AuthSection />
    </div>
  )
}
