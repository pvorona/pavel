import { LoadingStatus } from '@pavel/types'
import classnames from 'classnames'
import React, { forwardRef } from 'react'
import styles from './Button.module.scss'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  variant?: 'button' | 'link'
  size?: 'md'
  loadingStatus?: LoadingStatus
  onClick?: (event: React.MouseEvent) => void
} & (ButtonElementProps | AnchorElementProps)

type ButtonElementProps = {
  type?: 'button' | 'submit'
  component?: 'button'
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

type AnchorElementProps = {
  component: 'a'
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

const baseClassName = 'outline-none transition-all'
const defaultButtonClassName =
  'text-lg bg-gray-4 text-white bg-gray-4 border border-gray-4 rounded'
// Find better dark:interaction colors
const defaultLinkClassName = 'dark:text-gray-10'
const defaultLinkInteractionsClassName =
  'text-gray-6 hover:text-gray-9 dark:hover:text-white dark:focus:text-white hover:underline focus:underline underline-offset-4 '
const mdButtonClassName = 'py-3 px-8'

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    className,
    size = 'md',
    variant = 'button',
    component: Component = 'button',
    loadingStatus = LoadingStatus.IDLE,
    children,
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={classnames(
        styles['base'],
        baseClassName,
        {
          [styles['button']]: variant === 'button',
          [styles['link']]: variant === 'link',
          [mdButtonClassName]: variant === 'button' && size === 'md',
          [defaultButtonClassName]: variant === 'button',
          [defaultLinkClassName]: variant === 'link',
          [defaultLinkInteractionsClassName]: variant === 'link',
        },
        className,
      )}
      {...props}
    >
      <div
        className={classnames(styles['progress'], {
          [styles['loading']]: loadingStatus === LoadingStatus.IN_PROGRESS,
          [styles['loaded']]: loadingStatus === LoadingStatus.COMPLETED,
        })}
      />
      <div className="relative">{children}</div>
    </Component>
  )
})
