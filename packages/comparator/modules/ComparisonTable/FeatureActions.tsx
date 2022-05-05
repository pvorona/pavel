import classNames from 'classnames'
import { Feature } from '@pavel/comparator-shared'
import {
  toggleFeatureExpandedInCurrentComparison,
  removeFeatureFromCurrentComparison,
  toggleDescriptionExpandedInCurrentComparison,
} from '../../modules/comparisons'
import {
  DotIcon,
  IconTransitionGroup,
  Direction,
  HoldConfirmationButton,
  ButtonBase,
} from '@pavel/components'
import { useDispatch } from 'react-redux'
import React, { useState } from 'react'

const iconClassName = 'ml-2'

export function FeatureActions({
  featureId,
  isOpen,
}: {
  featureId: string
  isOpen: boolean
}) {
  const dispatch = useDispatch()
  const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false)

  function onToggleExpandedClick() {
    dispatch(toggleFeatureExpandedInCurrentComparison(featureId) as any)
  }

  function onRemoveFeatureClick() {
    dispatch(removeFeatureFromCurrentComparison(featureId) as any)
  }

  function onDescriptionExpandedClick() {
    dispatch(toggleDescriptionExpandedInCurrentComparison(featureId) as any)
  }

  return (
    <IconTransitionGroup
      direction={isOpen ? Direction.Straight : Direction.Inverse}
      isOpen={isOpen}
    >
      <ButtonBase
        className={iconClassName}
        onClick={onDescriptionExpandedClick}
      >
        <DotIcon color="green" />
      </ButtonBase>
      <ButtonBase className={iconClassName} onClick={onToggleExpandedClick}>
        <DotIcon color="yellow" />
      </ButtonBase>
      <HoldConfirmationButton
        onConfirmationCompleted={onRemoveFeatureClick}
        onConfirmationStart={() => setIsConfirmingDeletion(true)}
        onConfirmationCancel={() => setIsConfirmingDeletion(false)}
        className={iconClassName}
      >
        <DotIcon
          color="red"
          loading={isConfirmingDeletion}
          className={classNames({
            'cursor-none': isConfirmingDeletion,
          })}
        />
      </HoldConfirmationButton>
    </IconTransitionGroup>
  )
}
