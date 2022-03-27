import {
  selectOptionFeatureValue,
  setOptionFeatureValue,
} from '../../modules/options'
import { TextField } from '@pavel/components'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import styles from './OptionFeatureCell.module.scss'

export const OptionFeatureCell = memo(function OptionFeatureCell({
  featureId,
  optionId,
}: {
  featureId: string
  optionId: string
}) {
  const dispatch = useDispatch()
  const optionFeatureValue = useSelector(
    selectOptionFeatureValue(optionId, featureId),
  )

  function onOptionFeatureInput(
    featureId: string,
    optionId: string,
    value: string,
  ) {
    dispatch(
      setOptionFeatureValue({
        value,
        featureId,
        optionId,
      }),
    )
  }

  return (
    <TextField
      placeholder="No data"
      onInput={value => onOptionFeatureInput(featureId, optionId, value)}
      className={classNames(
        'px-12 py-2 font-light dark:font-extralight text-lg',
        styles['Text'],
      )}
    >
      {optionFeatureValue}
    </TextField>
  )
})
