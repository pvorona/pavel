import {
  selectOptionFeatureValue,
  setOptionFeatureValue,
} from '../../modules/options'
import { TextField } from '../../shared'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
    e: React.FormEvent<HTMLInputElement>,
  ) {
    dispatch(
      setOptionFeatureValue({
        value: e.currentTarget.value,
        featureId,
        optionId,
      }),
    )
  }

  return (
    <TextField
      placeholder="Feature value"
      onInput={e => onOptionFeatureInput(featureId, optionId, e)}
      className="px-12 py-2 font-extralight"
    >
      {optionFeatureValue}
    </TextField>
  )
})
