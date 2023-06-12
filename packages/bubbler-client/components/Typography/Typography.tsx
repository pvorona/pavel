import classNames from 'classnames'
import styles from './Typography.module.scss'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export function Typography({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return <div className={classNames(className, styles.TextShadow)} {...props} />
}
