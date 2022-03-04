import classNames from 'classnames'
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
    <div className="absolute bottom-0 translate-y-full invisible hover:visible group-hover:visible group-focus-within:visible left-1/2 -translate-x-1/2">
      <div className={classNames('flex py-2 px-8')}>
        <IconButton color="red" onClick={onRemoveOptionClick} />
      </div>
    </div>
  )
})
