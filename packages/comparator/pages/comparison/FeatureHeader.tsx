import classNames from 'classnames'
import {
  selectCurrentComparisonFeatureById,
  setFeaturePropertyInCurrentComparison,
} from '../../modules/comparisons'
import { TextField } from '@pavel/components'
import { useDispatch, useSelector } from 'react-redux'
import { FeatureActions } from './FeatureActions'

export function FeatureHeader({ id, index }: { id: string; index: number }) {
  const dispatch = useDispatch()
  const feature = useSelector(selectCurrentComparisonFeatureById(id))
  const isDescriptionVisible =
    feature.isExpanded && feature.isDescriptionExpanded

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

  return (
    // <div className="inline-block sticky left-0 px-3 bg-white dark:bg-[#202124]">
    <div className="inline-block sticky left-0">
      <div className="flex flex-row items-center group">
        <TextField
          onInput={onFeatureNameChange}
          placeholder="Feature name"
          className={classNames(
            'px-3 py-2 font-extralight text-sm tracking-widest transition-colors text-gray-2 dark:text-gray-1',
          )}
        >
          {feature.name}
        </TextField>
        <FeatureActions index={index} feature={feature} />
      </div>
      {isDescriptionVisible && (
        <TextField
          onInput={onFeatureDescriptionChange}
          placeholder="Feature description..."
          className="px-3 inline-block min-w-[100px] text-xs text-gray-1 font-extralight"
        >
          {feature.description}
        </TextField>
      )}
    </div>
  )
}
