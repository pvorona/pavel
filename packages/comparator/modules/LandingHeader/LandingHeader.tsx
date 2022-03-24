import { signOut, SIGN_IN, SIGN_UP } from '@pavel/comparator-shared'
import { Button, Variant, Link } from '@pavel/components'
import classNames from 'classnames'
import { useAuthUser } from 'next-firebase-auth'
import NextLink from 'next/link'
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import styles from './LandingHeader.module.scss'

function AuthSection() {
  const { id } = useAuthUser()

  if (id) {
    return (
      <Button onClick={signOut} variant={Variant.Link} size="sm">
        Sign out
      </Button>
    )
  }

  return (
    <>
      <NextLink href={SIGN_IN} passHref>
        <Link rounded size="sm" variant={Variant.Outlined}>
          Sign in
        </Link>
      </NextLink>
      <NextLink href={SIGN_UP} passHref>
        <Link variant={Variant.Filled} className="ml-4" size="sm">
          Sign up
        </Link>
      </NextLink>
    </>
  )
}

type LandingHeaderProps = PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>

export function LandingHeader({ children, ...props }: LandingHeaderProps) {
  return (
    <div
      className={classNames(
        'flex justify-between items-baseline relative whitespace-nowrap',
        styles['Header'],
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
