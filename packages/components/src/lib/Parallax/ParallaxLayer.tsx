import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import styles from './Parallax.module.scss'

export function ParallaxLayer({
  depth: z = 0,
  className,
  ...props
}: PropsWithChildren<{ depth?: number; className?: string }>) {
  return (
    <div
      className={classNames(className, styles['Layer'])}
      {...props}
      style={{
        transform: `translateZ(-${z}px) scale(${z + 1})`,
      }}
    />
  )
}
