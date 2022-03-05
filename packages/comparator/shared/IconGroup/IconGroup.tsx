import React, { ReactNode, ReactElement, PropsWithChildren } from 'react'
import { IconButton } from '../IconButton'

const DELAY = 50

export function IconGroup({ children }: { children: ReactNode }) {
  return (
    <>
      {React.Children.map<
        ReactElement<PropsWithChildren<typeof IconButton>>,
        ReactNode
      >(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null
        }

        return React.cloneElement(
          child,
          {
            style: {
              ...child.props.style,
              transitionDelay: `${DELAY * index}ms`,
            },
          },
          null,
        )
      })}
    </>
  )
}
