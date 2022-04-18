import classNames from 'classnames'
import styles from './IconButton.module.scss'

export const IconButton = ({
  onClick,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => (
  <button
    onClick={onClick}
    className={classNames(
      styles['icon'],
      'transition-colors cursor-pointer outline-none',
    )}
    {...props}
  />
)
