import { LoadingStatus } from '@pavel/types'
import classNames from 'classnames'
import React, {
  ReactNode,
  forwardRef,
  MouseEvent,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
} from 'react'
import styles from './Button.module.scss'
import { LoadingProgress } from './LoadingProgress'

export enum Variant {
  Filled,
  Outlined,
  Link,
  Unstyled,
}

export type BaseButtonProps = {
  children: ReactNode
  className?: string
  variant?: Variant
  rounded?: boolean
  size?: 'sm' | 'md'
  loadingStatus?: LoadingStatus
  onClick?: (event: MouseEvent) => void
  labelClassName?: string
}

export type ButtonProps = BaseButtonProps & ButtonElementProps

type ButtonElementProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const smButtonClassName = 'py-2 px-6 text-sm'
const mdButtonClassName = 'py-3 px-8 text-lg'

const ButtonLikeVariants = [Variant.Filled, Variant.Outlined, Variant.Unstyled]

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      rounded,
      className,
      size = 'md',
      variant = Variant.Filled,
      loadingStatus = LoadingStatus.IDLE,
      children,
      ...props
    }: ButtonProps,
    ref,
  ) {
    const isButtonLike = ButtonLikeVariants.includes(variant)
    const allClassNames = classNames(
      styles['ButtonBase'],
      {
        'rounded-full': rounded,
        [styles['ButtonLike']]: isButtonLike,
        [styles['Filled']]: variant === Variant.Filled,
        [styles['Link']]: variant === Variant.Link,
        [styles['outlined']]: variant === Variant.Outlined,
        [smButtonClassName]: isButtonLike && size === 'sm',
        [mdButtonClassName]: isButtonLike && size === 'md',
      },
      className,
    )

    return (
      <button ref={ref} className={allClassNames} {...props}>
        <LoadingProgress status={loadingStatus} />
        {/* relative is required to create stacking context above progress indication */}
        <div className="relative">{children}</div>
      </button>
    )
  },
)

export type LinkProps = BaseButtonProps & AnchorElementProps

type AnchorElementProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Button(
  {
    className,
    rounded,
    size = 'md',
    variant = Variant.Link,
    loadingStatus = LoadingStatus.IDLE,
    children,
    labelClassName,
    ...props
  }: LinkProps,
  ref,
) {
  const isButtonLike = ButtonLikeVariants.includes(variant)
  const allClassNames = classNames(
    styles['ButtonBase'],
    {
      'rounded-full': rounded,
      [styles['ButtonLike']]: isButtonLike,
      [styles['Filled']]: variant === Variant.Filled,
      [styles['Link']]: variant === Variant.Link,
      [styles['outlined']]: variant === Variant.Outlined,
      [smButtonClassName]: isButtonLike && size === 'sm',
      [mdButtonClassName]: isButtonLike && size === 'md',
    },
    className,
  )

  return (
    <a ref={ref} className={allClassNames} {...props}>
      <LoadingProgress status={loadingStatus} />
      {/* relative is required to create stacking context above progress indication */}
      <div className={classNames(labelClassName, 'relative')}>{children}</div>
    </a>
  )
})
