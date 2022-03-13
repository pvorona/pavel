import classNames from 'classnames'
import { SVGProps } from 'react'
import styles from './IconButton.module.scss'

export const IconButton = ({
  onClick,
  ...props
}: SVGProps<SVGSVGElement> & {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <button
    onClick={onClick}
    type="button"
    className={classNames(
      styles['icon'],
      'transition-colors cursor-pointer outline-none',
    )}
  >
    <svg width={24} height={24} {...props} />
  </button>
)
