import classNames from 'classnames'
import { useSelector } from 'react-redux'
import {
  selectIsPreparingToRemoveOptionById,
  selectOptionSizeById,
  selectTableSize,
} from './comparisonTable.selectors'

export function OptionRemovingRectangle({ optionId }: { optionId: string }) {
  const { width } = useSelector(selectOptionSizeById(optionId))
  const { height } = useSelector(selectTableSize)
  const isPreparingToRemoveOption = useSelector(
    selectIsPreparingToRemoveOptionById(optionId),
  )

  return (
    <div
      style={{
        width,
        height,
      }}
      className={classNames(
        'absolute top-0 z-30 -translate-x-[1px] pointer-events-none rounded-sm bg-red-400 bg-opacity-20 border border-red-400 opacity-0 transition-opacity',
        {
          'opacity-100': isPreparingToRemoveOption,
        },
      )}
    />
  )
}
