import { LoadingStatus } from '@pavel/types'
import classnames from 'classnames'

import styles from './LoadingProgress.module.scss'

export const LoadingProgress = ({ status }: { status: LoadingStatus }) => {
  if (status === LoadingStatus.IDLE) {
    return null
  }

  return (
    <div
      className={classnames(styles['progress'], {
        [styles['loading']]: status === LoadingStatus.IN_PROGRESS,
        [styles['loaded']]: status === LoadingStatus.COMPLETED,
      })}
    />
  )
}
