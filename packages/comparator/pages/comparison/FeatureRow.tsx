import {
  selectCurrentComparisonFeatureIndexById,
  selectCurrentComparisonOptionIds,
  selectIsCurrentComparisonFeatureExpandedById,
} from '../../modules/comparisons'
import { memo, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { AddFeatureLine } from './AddFeatureLine'
import { FeatureHeader } from './FeatureHeader'
import { OptionFeatureCell } from './OptionFeatureCell'

export const FeatureRow = memo(function FeatureRow({
  featureId,
}: {
  featureId: string
}) {
  const optionIds = useSelector(selectCurrentComparisonOptionIds)
  const index = useSelector(selectCurrentComparisonFeatureIndexById(featureId))
  const isFeatureExpanded = useSelector(
    selectIsCurrentComparisonFeatureExpandedById(featureId),
  )

  return (
    <Fragment>
      {index === 0 && (
        <tr className="relative z-10">
          <td colSpan={optionIds.length}>
            <AddFeatureLine index={index} />
          </td>
        </tr>
      )}

      <tr className={`top-[72px]`}>
        <td className="pt-10" colSpan={optionIds.length}>
          <FeatureHeader index={index} id={featureId} />
        </td>
      </tr>

      {isFeatureExpanded && (
        <tr>
          {optionIds.map(optionId => (
            <td
              key={optionId}
              // style={{ width: `${100 / optionIds.length}%` }}
              className="align-top"
            >
              <OptionFeatureCell featureId={featureId} optionId={optionId} />
            </td>
          ))}
        </tr>
      )}

      <tr className="relative z-10">
        <td colSpan={optionIds.length}>
          <AddFeatureLine index={index + 1} />
        </td>
      </tr>
    </Fragment>
  )
})
