import { TextField } from '../../shared/TextField'
import { selectOptionNameById, setOptionProperty } from '../../modules/options'
import { FormEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'

export function OptionTitle({ optionId }: { optionId: string }) {
  const optionName = useSelector(selectOptionNameById(optionId))
  const dispatch = useDispatch()

  function onOptionNameChanged(event: FormEvent<HTMLInputElement>) {
    dispatch(
      setOptionProperty({
        id: optionId,
        name: event.currentTarget.value,
      }),
    )
  }

  return (
    <TextField
      className="px-12 py-4 w-full inline-block peer font-extralight text-4xl text-left"
      onInput={onOptionNameChanged}
    >
      {optionName}
    </TextField>
  )
}
