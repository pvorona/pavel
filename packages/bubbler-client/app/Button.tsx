import classNames from 'classnames'
import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react'

import styles from './Button.module.scss'

export function Button({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return <button {...props} className={classNames(styles.Button, className)} />
}
