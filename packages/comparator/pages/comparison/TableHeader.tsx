import { selectCurrentComparisonOptionIds } from '../../modules/comparisons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { OptionHeader } from './OptionHeader'

export const TableHeader = memo(function TableHeader() {
  const optionIds = useSelector(selectCurrentComparisonOptionIds)

  return (
    <>
      {optionIds.map(optionId => (
        <th
          key={optionId}
          className="relative"
          // style={{ width: `${(100 / optionIds.length)}%` }}
        >
          <OptionHeader optionId={optionId} />
        </th>
      ))}
    </>
  )
})
