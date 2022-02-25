import classnames from 'classnames'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'link'
}

const commonColors = 'border rounded transition-colors'
const darkColors =
  'dark:bg-dark-1 dark:border-dark-2 dark:hover:border-dark-3 dark:text-dark-text'
const lightColors = ''
// const lightColors = 'bg-black text-white'

export function Button({ className, type = 'button', ...props }: ButtonProps) {
  const defaultButtonClassName = commonColors + darkColors + lightColors
  const defaultLinkClassName =
    'dark:hover:text-dark-text hover:underline underline-offset-4 transition-colors'

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
