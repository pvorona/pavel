import classNames from 'classnames'
import { Feature } from '@pavel/comparator-shared'
import {
  toggleFeatureExpandedInCurrentComparison,
  removeFeatureFromCurrentComparison,
  toggleDescriptionExpandedInCurrentComparison,
} from '../../modules/comparisons'
import { DotButton, IconTransitionGroup, Direction } from '@pavel/components'
import { useDispatch } from 'react-redux'
import React from 'react'

export function FeatureActions({
  featureId,
  isOpen,
}: {
  featureId: string
  isOpen: boolean
}) {
  const dispatch = useDispatch()

  function onToggleExpandedClick() {
    dispatch(toggleFeatureExpandedInCurrentComparison(featureId))
  }

  function onRemoveFeatureClick() {
    dispatch(removeFeatureFromCurrentComparison(featureId))
  }

  function onDescriptionExpandedClick() {
    dispatch(toggleDescriptionExpandedInCurrentComparison(featureId))
  }

  const iconClassName = 'ml-2'

  return (
    <IconTransitionGroup
      direction={isOpen ? Direction.Straight : Direction.Inverse}
      isOpen={isOpen}
    >
      <DotButton
        color="green"
        className={iconClassName}
        onClick={onDescriptionExpandedClick}
      />
      <DotButton
        color="yellow"
        className={iconClassName}
        onClick={onToggleExpandedClick}
      />
      <DotButton
        color="red"
        className={iconClassName}
        onClick={onRemoveFeatureClick}
      />
    </IconTransitionGroup>
  )
}
