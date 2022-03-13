import classNames from 'classnames'
import { memo } from 'react'

export const DotButton = memo(function IconButton({
  className,
  color = 'white',
  ...props
}: {
  color?: 'red' | 'white' | 'green' | 'yellow'
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={classNames(
        'inline-block cursor-pointer w-4 h-4 border border-current rounded-full bg-current',
        className,
        {
          'text-red-500': color === 'red',
          'text-white': color === 'white',
          'text-yellow-300': color === 'yellow',
          'text-green-400': color === 'green',
        },
      )}
      {...props}
    />
  )
})
