import { selectCurrentComparisonFeatureIds } from '../../modules/comparisons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { FeatureRow } from './FeatureRow'
import { Button } from '@pavel/components'

export const TableBody = memo(function FeatureRows() {
  const featureIds = useSelector(selectCurrentComparisonFeatureIds)

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
      {featureIds.map(featureId => (
        <FeatureRow featureId={featureId} key={featureId} />
      ))}
    </>
  )
})
