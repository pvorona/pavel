import React, { ReactNode } from 'react'

const DELAY = 50

export enum Direction {
  Straight = 0,
  Inverse = 1,
}

export function IconGroup({
  children,
  direction = Direction.Straight,
}: {
  children: ReactNode
  direction: Direction
}) {
  const childrenArray = React.Children.toArray(children)

  return (
    <>
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) {
          return null
        }

        return React.cloneElement(
          child,
          {
            style: {
              ...child.props.style,
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
    </>
  )
}

function getItemDelay(index: number) {
  return `${DELAY * index}ms`
}
