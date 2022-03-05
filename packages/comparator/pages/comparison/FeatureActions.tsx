import classNames from 'classnames'
import {
  Feature,
  toggleFeatureExpandedInCurrentComparison,
  removeFeatureFromCurrentComparison,
  toggleDescriptionExpandedInCurrentComparison,
} from '../../modules/comparisons'
import { IconButton, IconGroup } from '@pavel/components'
import { useDispatch } from 'react-redux'
import React from 'react'

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

  const iconClassName =
    'ml-2 opacity-0 scale-0 group-focus-within:opacity-100 group-hover:opacity-100 group-focus-within:scale-100 group-hover:scale-100 transition-all'

  return (
    <div
      className={classNames(
        // 'flex opacity-0 transition-opacity group',
        'flex group',
        className,
      )}
      {...props}
    >
      <IconGroup>
        {feature.isExpanded && (
          <IconButton
            color="green"
            className={iconClassName}
            onClick={onDescriptionExpandedClick}
          />
        )}
        <IconButton
          color="yellow"
          className={iconClassName}
          onClick={onToggleExpandedClick}
        />
        <IconButton
          color="red"
          className={iconClassName}
          onClick={onRemoveFeatureClick}
        />
      </IconGroup>
    </div>
  )
}
