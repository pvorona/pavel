import { selectCurrentComparisonOptionIds } from '../../modules/comparisons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { OptionHeader } from './OptionHeader'

export const TableHeader = memo(function TableHeader() {
  const optionIds = useSelector(selectCurrentComparisonOptionIds)

  return (
    <>
      {optionIds.map(optionId => (
        <OptionHeader key={optionId} optionId={optionId} />
      ))}
    </>
  )
})
