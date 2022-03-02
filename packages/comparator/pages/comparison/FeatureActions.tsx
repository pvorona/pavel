import classNames from 'classnames'
import {
  Feature,
  toggleFeatureExpandedInCurrentComparison,
  removeFeatureFromCurrentComparison,
  toggleDescriptionExpandedInCurrentComparison,
} from '../../modules/comparisons'
import { IconButton } from '../../shared'
import { useDispatch } from 'react-redux'

export function FeatureActions({
  index,
  feature,
  className,
  ...props
}: { index: number; feature: Feature } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const dispatch = useDispatch()

  function onToggleExpandedClick() {
    dispatch(toggleFeatureExpandedInCurrentComparison(index))
  }

  function onRemoveFeatureClick() {
    dispatch(removeFeatureFromCurrentComparison(index))
  }

  function onDescriptionExpandedClick() {
    dispatch(toggleDescriptionExpandedInCurrentComparison(index))
  }

  return (
    <div
      className={classNames(
        'flex ml-2 opacity-0 transition-opacity',
        className,
      )}
      {...props}
    >
      <IconButton color="gray" onClick={onToggleExpandedClick} />
      {feature.isExpanded && (
        <IconButton
          color="green"
          onClick={onDescriptionExpandedClick}
          className="ml-2"
        />
      )}
      <IconButton color="red" onClick={onRemoveFeatureClick} className="ml-2" />
    </div>
  )
}
