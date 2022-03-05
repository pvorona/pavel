import { removeOptionIdFromCurrentComparison } from '../../modules/comparisons'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from '../../shared'

export const OptionActions = memo(function OptionActions({
  optionId,
}: {
  optionId: string
}) {
  const dispatch = useDispatch()

  function onRemoveOptionClick() {
    dispatch(removeOptionIdFromCurrentComparison(optionId))
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 mt-[2px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 scale-0 group-hover:scale-100 group-focus-within:scale-100 right-0 -translate-x-1/2 transition-all">
      <div className="flex flex-col p-2">
        <IconButton
          className="mt-2"
          color="red"
          onClick={onRemoveOptionClick}
        />
        {/* <IconButton className='mt-2' color="yellow" onClick={onRemoveOptionClick} /> */}
      </div>
    </div>
  )
})
