import classNames from 'classnames'
import {
  selectCurrentComparisonFeatureById,
  setFeaturePropertyInCurrentComparison,
} from '../../modules/comparisons'
import { TextField } from '@pavel/components'
import { useDispatch, useSelector } from 'react-redux'
import { FeatureActions } from './FeatureActions'
import { useState } from 'react'

export function FeatureHeader({ id, index }: { id: string; index: number }) {
  const dispatch = useDispatch()
  const feature = useSelector(selectCurrentComparisonFeatureById(id))
  const [featureActionsShown, setFeatureActionsShown] = useState(false)

  function onFeatureNameChange(value: string) {
    dispatch(
      setFeaturePropertyInCurrentComparison({
        featureId: id,
        name: value,
      }),
    )
  }

  function onFeatureDescriptionChange(value: string) {
    dispatch(
      setFeaturePropertyInCurrentComparison({
        featureId: id,
        description: value,
      }),
    )
  }

  function showFeatureActions() {
    setFeatureActionsShown(true)
  }

  function hideFeatureActions() {
    setFeatureActionsShown(false)
  }

  return (
    // <div className="inline-block sticky left-0 px-3 bg-white dark:bg-[#202124]">
    <div className="inline-block sticky left-0">
      <div
        className="flex flex-row items-center group"
        onMouseEnter={showFeatureActions}
        onMouseLeave={hideFeatureActions}
      >
        <TextField
          onInput={onFeatureNameChange}
          placeholder="Feature name"
          className="px-3 py-1 font-extralight text-sm tracking-widest transition-colors text-gray-2 dark:text-gray-1"
        >
          {feature.name}
        </TextField>
        <FeatureActions
          index={index}
          feature={feature}
          isOpen={featureActionsShown}
        />
      </div>
      {feature.isDescriptionExpanded && (
        <TextField
          onInput={onFeatureDescriptionChange}
          placeholder="Feature description..."
          className="px-3 inline-block min-w-[100px] text-xs text-gray-1 font-extralight tracking-wider"
        >
          {feature.description}
        </TextField>
      )}
    </div>
  )
}
