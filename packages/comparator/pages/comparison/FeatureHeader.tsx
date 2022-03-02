import classNames from 'classnames'
import {
  selectCurrentComparisonFeatureById,
  setFeaturePropertyInCurrentComparison,
} from '../../modules/comparisons'
import { TextField } from '../../shared'
import { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FeatureActions } from './FeatureActions'

export function FeatureHeader({ id, index }: { id: string; index: number }) {
  const dispatch = useDispatch()
  const feature = useSelector(selectCurrentComparisonFeatureById(id))
  const isDescriptionVisible =
    feature.isExpanded && feature.isDescriptionExpanded

  function onFeatureNameChange(e: FormEvent<HTMLInputElement>) {
    dispatch(
      setFeaturePropertyInCurrentComparison({
        featureId: id,
        name: e.currentTarget.value,
      }),
    )
  }

  function onFeatureDescriptionChange(e: FormEvent<HTMLInputElement>) {
    dispatch(
      setFeaturePropertyInCurrentComparison({
        featureId: id,
        description: e.currentTarget.value,
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
            'px-3 py-2 opacity-50 font-extralight tracking-widest',
            {
              'opacity-20': !feature.isExpanded,
            },
          )}
        >
          {feature.name}
        </TextField>
        <FeatureActions
          index={index}
          feature={feature}
          className="group-hover:opacity-100"
        />
      </div>
      {isDescriptionVisible && (
        <TextField
          onInput={onFeatureDescriptionChange}
          placeholder="Feature description..."
          className="px-3 inline-block min-w-[100px] text-xs opacity-30 font-extralight"
        >
          {feature.description}
        </TextField>
      )}
    </div>
  )
}
