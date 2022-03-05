import classNames from 'classnames'
import React, { ReactNode } from 'react'

const DELAY = 50

export enum Direction {
  Straight = 0,
  Inverse = 1,
}

export function IconGroup({
  children,
  direction = Direction.Straight,
  isOpen,
  className,
}: {
  children: ReactNode
  direction: Direction
  isOpen: boolean
  className?: string
}) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div className={classNames('flex', className)}>
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) {
          return null
        }

        return React.cloneElement(
          child,
          {
            className: classNames(child.props.className, {
              'opacity-0 scale-0': !isOpen,
              'opacity-100 scale-100': isOpen,
            }),
            style: {
              ...child.props.style,
              transition:
                'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease',
              transitionDelay: getItemDelay(
                direction === Direction.Straight
                  ? index
                  : childrenArray.length - 1 - index,
              ),
            },
          },
          null,
        )
      })}
    </div>
  )
}

function getItemDelay(index: number) {
  return `${DELAY * index}ms`
}
