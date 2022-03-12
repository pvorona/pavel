import {
  removeOptionIdFromCurrentComparison,
  setOptionIdToRemove,
} from '../../modules'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { DotButton } from '@pavel/components'

export const OptionActions = memo(function OptionActions({
  optionId,
}: {
  optionId: string
}) {
  const dispatch = useDispatch()

  function onRemoveOptionMouseEnter() {
    dispatch(setOptionIdToRemove(optionId))
  }

  function onRemoveOptionMouseLeave() {
    dispatch(setOptionIdToRemove(null))
  }

  function onRemoveOptionClick() {
    dispatch(removeOptionIdFromCurrentComparison(optionId))
  }

  return (
    <DotButton
      className="absolute top-1/2 -translate-y-1/2 mr-4 mt-1 right-0 opacity-0 scale-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100 group-hover:scale-100 group-focus-within:scale-100"
      color="red"
      onMouseEnter={onRemoveOptionMouseEnter}
      onMouseLeave={onRemoveOptionMouseLeave}
      onClick={onRemoveOptionClick}
    />
  )
})
