import classNames from 'classnames'
import {
  Feature,
  toggleFeatureExpandedInCurrentComparison,
  removeFeatureFromCurrentComparison,
  toggleDescriptionExpandedInCurrentComparison,
} from '../../modules/comparisons'
import { IconButton } from '../../shared'
import { useDispatch } from 'react-redux'
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react'

export function FeatureActions({
  index,
  feature,
  className,
  ...props
}: { index: number; feature: Feature } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const dispatch = useDispatch()

  function onToggleExpandedClick() {
    dispatch(toggleFeatureExpandedInCurrentComparison(index))
  }

  function onRemoveFeatureClick() {
    dispatch(removeFeatureFromCurrentComparison(index))
  }

  function onDescriptionExpandedClick() {
    dispatch(toggleDescriptionExpandedInCurrentComparison(index))
  }

  return (
    <div
      className={classNames(
        // 'flex opacity-0 transition-opacity group',
        'flex transition-opacity group',
        className,
      )}
      {...props}
    >
      <IconGroup>
        {feature.isExpanded && (
          <IconButton
            color="green"
            className="ml-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-200"
            onClick={onDescriptionExpandedClick}
          />
        )}
        <IconButton
          color="yellow"
          className="ml-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-200"
          onClick={onToggleExpandedClick}
        />
        <IconButton
          color="red"
          onClick={onRemoveFeatureClick}
          className="ml-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-200"
        />
      </IconGroup>
    </div>
  )
}

const DELAYS = [
  'delay-[75ms]',
  'delay-[150ms]',
  'delay-[225ms]',
  'delay-[300ms]',
]

function IconGroup({ children }: { children: ReactNode }) {
  return (
    <>
      {React.Children.map<ReactNode, ReactNode>(children, (child, index) => {
        child as ReactElement<PropsWithChildren<typeof IconButton>>

        if (!React.isValidElement(child)) {
          return null
        }

        return React.cloneElement(
          child,
          {
            className: classNames(child.props.className, DELAYS[index]),
          },
          null,
        )
      })}
    </>
  )
}
