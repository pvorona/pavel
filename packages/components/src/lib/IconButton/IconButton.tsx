import classNames from 'classnames'
import styles from './IconButton.module.scss'

export const IconButton = ({
  onClick,
  type = 'button',
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => (
  <button
    onClick={onClick}
    type={type}
    className={classNames(
      className,
      styles['icon'],
      'transition-colors cursor-pointer outline-none',
    )}
    {...props}
  />
)
