import classNames from 'classnames'
import { DetailedHTMLProps, ButtonHTMLAttributes } from 'react'

import styles from './Button.module.scss'

export enum ButtonSize {
  Sm,
  Lg,
}

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { size: ButtonSize }

export function Button({ size, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(styles.Button, className, {
        [styles.Lg]: size === ButtonSize.Lg,
        [styles.Sm]: size === ButtonSize.Sm,
      })}
    />
  )
}
