import classnames from 'classnames'
import React, { forwardRef } from 'react'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  variant?: 'button' | 'link'
  size?: 'md'
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
const defaultButtonInteractionsClassName =
  'hover:bg-gray-9 focus:bg-gray-9 dark:hover:bg-gray-4 dark:focus:bg-gray-4 dark:hover:border-[#5f6368] duration-200 shadow-md'
const defaultLinkClassName = 'dark:text-gray-10'
const defaultLinkInteractionsClassName =
  'text-gray-6 hover:text-gray-9 dark:hover:text-white dark:focus:text-white hover:underline focus:underline underline-offset-4 '
const mdButtonClassName = 'py-3 px-8'
const disabledClassName = 'opacity-40 cursor-not-allowed'

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    className,
    size = 'md',
    variant = 'button',
    component: Component = 'button',
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={classnames(
        baseClassName,
        {
          [mdButtonClassName]: variant === 'button' && size === 'md',
          [defaultButtonClassName]: variant === 'button',
          [defaultButtonInteractionsClassName]:
            variant === 'button' && !props.disabled,
          [defaultLinkClassName]: variant === 'link',
          [defaultLinkInteractionsClassName]: variant === 'link',
          [disabledClassName]: props.disabled,
        },
        className,
      )}
      {...props}
    />
  )
})
