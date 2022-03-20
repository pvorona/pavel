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
  function ButtonBase(props: ButtonBaseProps, ref) {
    return (
      <button
        className={classNames(styles['ButtonBase'], props.className)}
        {...props}
        ref={ref}
      />
    )
  },
)
