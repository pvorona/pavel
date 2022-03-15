import { LoadingStatus } from '@pavel/types'
import classnames from 'classnames'

import styles from './LoadingProgress.module.scss'

export enum Color {
  Light,
  Dark,
}

export const LoadingProgress = ({
  status,
  color,
}: {
  status: LoadingStatus
  color: Color
}) => {
  if (status === LoadingStatus.IDLE) {
    return null
  }

  return (
    <div
      className={classnames(styles['progress'], {
        [styles['loading']]: status === LoadingStatus.IN_PROGRESS,
        [styles['loaded']]: status === LoadingStatus.COMPLETED,
        [styles['light']]: color === Color.Light,
        [styles['dark']]: color === Color.Dark,
      })}
    />
  )
}
