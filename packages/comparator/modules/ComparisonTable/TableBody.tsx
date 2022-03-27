import {
  selectCurrentComparisonFeatureIds,
  selectCurrentComparisonOptionIds,
} from '../../modules/comparisons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { FeatureRow } from './FeatureRow'
import { Button } from '@pavel/components'
import { OptionRemovingRectangle } from './OptionRemovingRectangle'

import {
  selectIsLastOptionInCurrentComparisonById,
  selectCurrentComparisonOptionIndexById,
} from '../../modules/comparisons'
import { AddOptionLine } from './AddOptionLine'

function AddOptionLines({ optionId }: { optionId: string }) {
  const isLastOption = useSelector(
    selectIsLastOptionInCurrentComparisonById(optionId),
  )
  const optionIndex = useSelector(
    selectCurrentComparisonOptionIndexById(optionId),
  )

  return (
    <>
      <AddOptionLine attachment="left" index={optionIndex} />
      {isLastOption && (
        <AddOptionLine attachment="right" index={optionIndex + 1} />
      )}
    </>
  )
}

export const TableBody = memo(function FeatureRows() {
  const featureIds = useSelector(selectCurrentComparisonFeatureIds)
  const optionIds = useSelector(selectCurrentComparisonOptionIds)

  if (featureIds.length === 0) {
    return (
      <tr>
        <td>
          <div className="flex flex-col items-center justify-center h-[640px]">
            <div>Empty comparison</div>
            <Button className="mt-4">Add Option</Button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <>
      <tr>
        {optionIds.map(optionId => (
          <td key={optionId}>
            <OptionRemovingRectangle optionId={optionId} />
          </td>
        ))}
      </tr>
      <tr>
        {optionIds.map(optionId => (
          <td className="relative" key={optionId}>
            <AddOptionLines optionId={optionId} />
          </td>
        ))}
      </tr>
      {featureIds.map(featureId => (
        <FeatureRow featureId={featureId} key={featureId} />
      ))}
    </>
  )
})
