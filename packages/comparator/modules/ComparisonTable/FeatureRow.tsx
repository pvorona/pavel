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
import classNames from 'classnames'

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

      <tr>
        <td
          className={classNames({
            'pt-10': index !== 0,
            'pt-5': index === 0,
          })}
          colSpan={optionIds.length}
        >
          <FeatureHeader featureId={featureId} />
        </td>
      </tr>

      {isFeatureExpanded && (
        <tr>
          {optionIds.map(optionId => (
            <td key={optionId} className="align-top">
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
