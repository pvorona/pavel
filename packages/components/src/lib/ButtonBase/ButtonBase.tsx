import classNames from 'classnames'
import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  forwardRef,
  PropsWithChildren,
} from 'react'
import styles from './ButtonBase.module.scss'

type ButtonElementProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export type ButtonBaseProps = PropsWithChildren<ButtonElementProps>

export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  function ButtonBase({ className, ...props }: ButtonBaseProps, ref) {
    return (
      <button
        className={classNames(styles['ButtonBase'], className)}
        {...props}
        ref={ref}
      />
    )
  },
)
