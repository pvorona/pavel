import {
  selectIsLastOptionInCurrentComparisonById,
  selectCurrentComparisonOptionIndexById,
} from '../../modules/comparisons'
import { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OptionActions } from './OptionActions'
import { OptionTitle } from './OptionTitle'
import { AddOptionLine } from './AddOptionLine'
import useResizeObserver from 'use-resize-observer'
import { setOptionSize } from './comparisonTable.slice'

export const OptionHeader = memo(function OptionHeader({
  optionId,
}: {
  optionId: string
}) {
  const dispatch = useDispatch()
  const { ref, width, height } = useResizeObserver<HTMLTableCellElement>()
  const isLastOption = useSelector(
    selectIsLastOptionInCurrentComparisonById(optionId),
  )
  const optionIndex = useSelector(
    selectCurrentComparisonOptionIndexById(optionId),
  )

  useEffect(() => {
    dispatch(setOptionSize({ size: { width, height }, optionId }))
  }, [width, height, dispatch, optionId])

  return (
    <th ref={ref} className="relative">
      <AddOptionLine attachment="left" index={optionIndex} />
      <div className="group relative">
        <OptionTitle optionId={optionId} />
        <OptionActions optionId={optionId} />
      </div>
      {isLastOption && (
        <AddOptionLine attachment="right" index={optionIndex + 1} />
      )}
    </th>
  )
})
