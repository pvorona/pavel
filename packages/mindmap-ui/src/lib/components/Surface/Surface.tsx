import classNames from 'classnames'
import styles from './Surface.module.scss'

type SurfaceProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  withBorder?: boolean
  rounded?: boolean
}

export function Surface({
  className,
  withBorder,
  rounded,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={classNames(styles['Root'], className, {
        [styles['WithBorder']]: withBorder,
        [styles['Rounded']]: rounded,
      })}
      {...props}
    />
  )
}
