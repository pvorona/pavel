import { TextField } from '@pavel/components'
import { selectOptionNameById, setOptionProperty } from '../../modules/options'
import { useSelector, useDispatch } from 'react-redux'
import { memo } from 'react'

export const OptionTitle = memo(function OptionTitle({
  optionId,
}: {
  optionId: string
}) {
  const optionName = useSelector(selectOptionNameById(optionId))
  const dispatch = useDispatch()

  function onOptionNameChanged(value: string) {
    dispatch(
      setOptionProperty({
        id: optionId,
        name: value,
      }),
    )
  }

  return (
    <TextField
      className="px-12 py-4 w-full inline-block font-light text-4xl text-left"
      onInput={onOptionNameChanged}
    >
      {optionName}
    </TextField>
  )
})
