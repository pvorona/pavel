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
import { Color, LoadingProgress } from './LoadingProgress'

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

const defaultLinkClassName = 'dark:text-gray-10'
const defaultLinkInteractionsClassName =
  'text-gray-6 hover:text-gray-9 dark:hover:text-white dark:focus:text-white hover:underline focus:underline underline-offset-4 '
const smButtonClassName = 'py-2 px-6 text-sm'
const mdButtonClassName = 'py-3 px-8 text-lg'

const ButtonLikeVariants = [Variant.Filled, Variant.Outlined, Variant.Unstyled]

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
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
        [styles['ButtonLike']]: isButtonLike,
        [styles['Filled']]: variant === Variant.Filled,
        [styles['link']]: variant === Variant.Link,
        [styles['outlined']]: variant === Variant.Outlined,
        [smButtonClassName]: isButtonLike && size === 'sm',
        [mdButtonClassName]: isButtonLike && size === 'md',
        // [filledButtonClassName]: variant === Variant.Filled,
        [defaultLinkClassName]: variant === Variant.Link,
        [defaultLinkInteractionsClassName]: variant === Variant.Link,
      },
      className,
    )

    return (
      <button ref={ref} className={allClassNames} {...props}>
        <LoadingProgress
          color={variant === Variant.Filled ? Color.Dark : Color.Light}
          status={loadingStatus}
        />
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
      [styles['ButtonLike']]: isButtonLike,
      [styles['Filled']]: variant === Variant.Filled,
      [styles['link']]: variant === Variant.Link,
      [styles['outlined']]: variant === Variant.Outlined,
      [smButtonClassName]: isButtonLike && size === 'sm',
      [mdButtonClassName]: isButtonLike && size === 'md',
      // [filledButtonClassName]: variant === Variant.Filled,
      [defaultLinkClassName]: variant === Variant.Link,
      [defaultLinkInteractionsClassName]: variant === Variant.Link,
    },
    className,
  )

  return (
    <a ref={ref} className={allClassNames} {...props}>
      <LoadingProgress color={Color.Light} status={loadingStatus} />
      {/* relative is required to create stacking context above progress indication */}
      <div className={classNames(labelClassName, 'relative')}>{children}</div>
    </a>
  )
})
