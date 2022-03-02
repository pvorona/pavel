import classNames from 'classnames'
import { memo } from 'react'

export const IconButton = memo(function IconButton({
  className,
  color = 'white',
  ...props
}: {
  color?: 'red' | 'white' | 'gray' | 'green'
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={classNames(
        'inline-block cursor-pointer w-5 h-5 border border-current rounded-full bg-current',
        className,
        {
          'text-red-500': color === 'red',
          'text-white': color === 'white',
          'text-gray-500': color === 'gray',
          'text-green-400': color === 'green',
        },
      )}
      {...props}
    />
  )
})
