import classnames from 'classnames'
import React from 'react'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'link'
  size?: 'md'
  onClick?: (event: React.MouseEvent) => void
}

export function Button({ className, type = 'button', ...props }: ButtonProps) {
  const defaultButtonClassName =
    'text-lg bg-gray-4 text-white bg-gray-4 dark:hover:border-[#5f6368] border border-gray-4 rounded transition-colors'
  const defaultLinkClassName =
    'dark:hover:text-white hover:underline underline-offset-4 transition-colors'
  const mdSizeClassName = 'py-3 px-8'

  return (
    <button
      className={classnames(
        mdSizeClassName,
        {
          [defaultButtonClassName]: type === 'button',
          [defaultLinkClassName]: type === 'link',
        },
        className,
      )}
      type="button"
      {...props}
    />
  )
}