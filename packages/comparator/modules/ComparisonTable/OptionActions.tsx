import {
  removeOptionIdFromCurrentComparison,
  setOptionIdToRemove,
} from '../../modules'
import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DotIcon, HoldConfirmationButton } from '@pavel/components'

export const OptionActions = memo(function OptionActions({
  optionId,
}: {
  optionId: string
}) {
  const dispatch = useDispatch()

  const [confirming, setConfirming] = useState(false)

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
    <HoldConfirmationButton
      className="absolute top-1/2 -translate-y-1/2 mr-5 mt-1 right-0 opacity-0 scale-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100 group-hover:scale-100 group-focus-within:scale-100"
      onMouseEnter={onRemoveOptionMouseEnter}
      onMouseLeave={onRemoveOptionMouseLeave}
      onFocus={onRemoveOptionMouseEnter}
      onBlur={onRemoveOptionMouseLeave}
      onConfirmationCompleted={onRemoveOptionClick}
      onConfirmationStart={() => setConfirming(true)}
      onConfirmationCancel={() => setConfirming(false)}
    >
      <DotIcon color="red" loading={confirming} />
    </HoldConfirmationButton>
  )
})
