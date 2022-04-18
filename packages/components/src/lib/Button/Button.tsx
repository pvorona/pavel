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
  size?: 'none' | 'sm' | 'md'
  loadingStatus?: LoadingStatus
  onClick?: (event: MouseEvent) => void
  labelProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
}

export type ButtonStyleOverrides = {
  '--color-light-default'?: string
  '--color-light-hover'?: string
  '--color-light-disabled'?: string
  '--color-dark-default'?: string
  '--color-dark-hover'?: string
  '--color-dark-disabled'?: string
  '--background-light-default'?: string
  '--background-light-hover'?: string
  '--background-light-disabled'?: string
  '--background-dark-default'?: string
  '--background-dark-hover'?: string
  '--background-dark-disabled'?: string
  '--global-background'?: string
  '--outline-color-dark'?: string
  '--outline-color-light'?: string
}

export type ButtonProps = BaseButtonProps &
  ButtonElementProps & {
    style?: React.CSSProperties & ButtonStyleOverrides
  }

type ButtonElementProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

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
      labelProps: { className: labelClassName, ...labelProps } = {},
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
        [styles['Outlined']]: variant === Variant.Outlined,
        [styles['Loading']]: loadingStatus === LoadingStatus.IN_PROGRESS,
      },
      className,
    )

    return (
      <button ref={ref} className={allClassNames} {...props}>
        <LoadingProgress status={loadingStatus} />
        {/* relative is required to create stacking context above progress indication */}
        <div
          {...labelProps}
          className={classNames(
            styles['Label'],
            labelClassName,
            'relative w-full',
            {
              [styles['Small']]: isButtonLike && size === 'sm',
              [mdButtonClassName]: isButtonLike && size === 'md',
            },
          )}
        >
          {children}
        </div>
      </button>
    )
  },
)

export type LinkProps = BaseButtonProps &
  LinkElementProps & {
    style?: React.CSSProperties & ButtonStyleOverrides
  }

type LinkElementProps = React.DetailedHTMLProps<
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
    labelProps: { className: labelClassName, ...labelProps } = {},

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
      [styles['Outlined']]: variant === Variant.Outlined,
      [styles['Loading']]: loadingStatus === LoadingStatus.IN_PROGRESS,
    },
    className,
  )

  return (
    <a ref={ref} className={allClassNames} {...props}>
      <LoadingProgress status={loadingStatus} />
      {/* relative is required to create stacking context above progress indication */}
      <div
        {...labelProps}
        className={classNames('relative w-full', labelClassName, {
          [styles['Small']]: isButtonLike && size === 'sm',
          [mdButtonClassName]: isButtonLike && size === 'md',
        })}
      >
        {children}
      </div>
    </a>
  )
})
