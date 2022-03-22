import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import styles from './Parallax.module.scss'

export function ParallaxContainer({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={classNames(className, styles['Container'])} {...props} />
  )
}
