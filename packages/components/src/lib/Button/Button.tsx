import classnames from 'classnames'
import React from 'react'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  variant?: 'button' | 'link'
  size?: 'md'
  buttonType?: 'button' | 'submit'
  onClick?: (event: React.MouseEvent) => void
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
const defaultButtonClassName =
  'text-lg bg-gray-4 text-white bg-gray-4 border border-gray-4 rounded outline-none'
const defaultButtonInteractionsClassName =
  'dark:hover:border-[#5f6368] transition-colors hover:bg-gray-9 focus:bg-gray-9 transition-opacity duration-200'
const defaultLinkClassName =
  'dark:hover:text-white hover:underline underline-offset-4 transition-colors'
const mdSizeClassName = 'py-3 px-8'
const disabledClassName = 'bg-gray-8 border-gray-8 cursor-not-allowed'

export function Button({
  className,
  size = 'md',
  variant = 'button',
  buttonType = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={classnames(
        {
          [mdSizeClassName]: size === 'md',
          [defaultButtonClassName]: variant === 'button',
          [defaultButtonInteractionsClassName]:
            variant === 'button' && !props.disabled,
          [defaultLinkClassName]: variant === 'link',
          [disabledClassName]: props.disabled,
        },
        className,
      )}
      {...props}
    />
  )
}
