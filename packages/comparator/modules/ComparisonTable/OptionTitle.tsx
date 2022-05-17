import { TextField } from '@pavel/components'
import { selectOptionNameById, setOptionProperty } from '../../modules/options'
import { useSelector, useDispatch } from 'react-redux'
import { memo } from 'react'
import classNames from 'classnames'
import styles from './OptionTitle.module.scss'

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
      className={classNames(
        styles.Root,
        'w-full inline-block text-left whitespace-nowrap font-semibold text-3xl',
      )}
      onInput={onOptionNameChanged}
    >
      {optionName}
    </TextField>
  )
})
