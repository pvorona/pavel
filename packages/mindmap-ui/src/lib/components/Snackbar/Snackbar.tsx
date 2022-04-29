import classNames from 'classnames'
import styles from './Snackbar.module.scss'

type SnackbarProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { isOpen?: boolean }

export function Snackbar({ className, isOpen, ...props }: SnackbarProps) {
  return (
    <div
      className={classNames(styles['Root'], className, {
        [styles['Visible']]: isOpen,
      })}
      {...props}
    />
  )
}
