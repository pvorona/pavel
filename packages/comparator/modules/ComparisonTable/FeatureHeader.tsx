import {
  selectCurrentComparisonFeatureById,
  setFeaturePropertyInCurrentComparison,
} from '../../modules/comparisons'
import { TextField } from '@pavel/components'
import { useDispatch, useSelector } from 'react-redux'
import { FeatureActions } from './FeatureActions'
import { useState } from 'react'
import classNames from 'classnames'
import styles from './FeatureHeader.module.scss'

export function FeatureHeader({ featureId }: { featureId: string }) {
  const dispatch = useDispatch()
  const feature = useSelector(selectCurrentComparisonFeatureById(featureId))
  const [featureActionsShown, setFeatureActionsShown] = useState(false)

  function onFeatureNameChange(value: string) {
    dispatch(
      setFeaturePropertyInCurrentComparison({
        featureId,
        name: value,
      }) as any,
    )
  }

  function onFeatureDescriptionChange(value: string) {
    dispatch(
      setFeaturePropertyInCurrentComparison({
        featureId,
        description: value,
      }) as any,
    )
  }

  function showFeatureActions() {
    setFeatureActionsShown(true)
  }

  function hideFeatureActions() {
    setFeatureActionsShown(false)
  }

  return (
    <div className="inline-block sticky left-0">
      <div
        className="flex flex-row items-center group"
        onMouseEnter={showFeatureActions}
        onMouseLeave={hideFeatureActions}
      >
        <TextField
          onInput={onFeatureNameChange}
          placeholder="Feature name"
          className={classNames(
            'px-3 py-1 text-xs transition-colors font-semibold tracking-[0.15em] uppercase',
            styles['FeatureName'],
          )}
        >
          {feature.name}
        </TextField>
        <FeatureActions featureId={featureId} isOpen={featureActionsShown} />
      </div>
      {feature.isDescriptionExpanded && (
        <TextField
          onInput={onFeatureDescriptionChange}
          placeholder="No description"
          className={classNames(
            'px-3 pb-2 inline-block min-w-[100px] text-xs tracking-wider',
            styles.FeatureDescription,
          )}
        >
          {feature.description}
        </TextField>
      )}
    </div>
  )
}
