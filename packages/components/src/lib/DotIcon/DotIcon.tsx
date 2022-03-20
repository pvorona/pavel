import classNames from 'classnames'
import { memo } from 'react'
import styles from './DotIcon.module.scss'

const ICON_SIZE = 16
const STROKE_WIDTH = 2

const R = ICON_SIZE / 2 - STROKE_WIDTH / 2
const circumference = 2 * Math.PI * R

export const DotIcon = memo(function DotIcon({
  className,
  color = 'white',
  loading = false,
  ...props
}: {
  color?: 'red' | 'white' | 'green' | 'yellow'
  loading?: boolean
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={classNames(
        'inline-block cursor-pointer w-4 h-4 rounded-full bg-current relative',
        className,
        {
          'text-red-500': color === 'red',
          'text-white': color === 'white',
          'text-yellow-300': color === 'yellow',
          'text-green-400': color === 'green',
        },
      )}
      {...props}
    >
      {loading && (
        <svg
          viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
          className="absolute w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-150"
        >
          <circle
            className={styles['Progressing']}
            stroke="rgb(239, 68, 68)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            cx={ICON_SIZE / 2}
            cy={ICON_SIZE / 2}
            r={R}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference}
          />
        </svg>
      )}
    </div>
  )
})
