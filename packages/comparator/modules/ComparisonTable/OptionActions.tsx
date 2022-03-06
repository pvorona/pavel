import {
  removeOptionIdFromCurrentComparison,
  setOptionIdToRemove,
} from '../../modules'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from '@pavel/components'

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
    <div className="absolute top-1/2 -translate-y-1/2 mr-2 right-0 opacity-0 scale-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100 group-hover:scale-100 group-focus-within:scale-100">
      <div className="flex flex-col p-2">
        <IconButton
          className="mt-2"
          color="red"
          onMouseEnter={onRemoveOptionMouseEnter}
          onMouseLeave={onRemoveOptionMouseLeave}
          onClick={onRemoveOptionClick}
        />
        {/* <IconButton className='mt-2' color="yellow" onClick={onRemoveOptionClick} /> */}
      </div>
    </div>
  )
})
