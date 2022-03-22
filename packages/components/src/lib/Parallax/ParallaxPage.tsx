import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import styles from './Parallax.module.scss'

export function ParallaxPage({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) {
  return <div className={classNames(styles['Page'], className)} {...props} />
}
