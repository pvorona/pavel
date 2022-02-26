import classnames from 'classnames'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'link'
}

export function Button({ className, type = 'button', ...props }: ButtonProps) {
  const defaultButtonClassName =
    'dark:bg-[#303134] dark:hover:border-[#5f6368] border border-[#303134] rounded transition-colors'
  const defaultLinkClassName =
    'dark:hover:text-white hover:underline underline-offset-4 transition-colors'

  return (
    <button
      className={classnames(
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
