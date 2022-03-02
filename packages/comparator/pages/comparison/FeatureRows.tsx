import { selectCurrentComparisonFeatureIds } from '../../modules/comparisons'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { FeatureRow } from './FeatureRow'

export const FeatureRows = memo(function FeatureRows() {
  const featureIds = useSelector(selectCurrentComparisonFeatureIds)

  return (
    <>
      {featureIds.map(featureId => (
        <FeatureRow featureId={featureId} key={featureId} />
      ))}
    </>
  )
})
