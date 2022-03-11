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

const baseClassName = 'outline-none'
const defaultButtonClassName =
  'text-lg bg-gray-4 text-white bg-gray-4 border border-gray-4 rounded'
const defaultButtonInteractionsClassName =
  'dark:hover:border-[#5f6368] transition-colors hover:bg-gray-9 focus:bg-gray-9 transition-opacity duration-200'
const defaultLinkClassName =
  'dark:hover:text-white dark:focus:text-white dark:text-gray-10 hover:underline focus:underline underline-offset-4 transition-colors'
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
      data-content={props.children}
      className={classnames(
        baseClassName,
        {
          [mdButtonClassName]: variant === 'button' && size === 'md',
          [defaultButtonClassName]: variant === 'button',
          [defaultButtonInteractionsClassName]:
            Component === 'button' && !props.disabled,
          [defaultLinkClassName]: variant === 'link',
          [disabledClassName]: props.disabled,
        },
        className,
      )}
      {...props}
    />
  )
})
