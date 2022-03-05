import {
  selectIsLastOptionInCurrentComparisonById,
  selectCurrentComparisonOptionIndexById,
} from '../../modules/comparisons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { OptionActions } from './OptionActions'
import { OptionTitle } from './OptionTitle'
import { AddOptionLine } from './AddOptionLine'

export const OptionHeader = memo(function OptionHeader({
  optionId,
}: {
  optionId: string
}) {
  const isLastOption = useSelector(
    selectIsLastOptionInCurrentComparisonById(optionId),
  )
  const optionIndex = useSelector(
    selectCurrentComparisonOptionIndexById(optionId),
  )

  return (
    <>
      <AddOptionLine attachment="left" index={optionIndex} />
      <div className="group">
        <OptionTitle optionId={optionId} />
        <OptionActions optionId={optionId} />
      </div>
      {isLastOption && (
        <AddOptionLine attachment="right" index={optionIndex + 1} />
      )}
    </>
  )
})
