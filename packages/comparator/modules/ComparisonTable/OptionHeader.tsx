import { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { OptionActions } from './OptionActions'
import { OptionTitle } from './OptionTitle'
import useResizeObserver from 'use-resize-observer'
import { setOptionSize } from './comparisonTable.slice'
import { linear } from '@pavel/easing'
import classNames from 'classnames'
import styles from './OptionHeader.module.scss'

export const OptionHeader = memo(function OptionHeader({
  optionId,
}: {
  optionId: string
}) {
  const dispatch = useDispatch()
  const { ref, width, height } = useResizeObserver<HTMLTableCellElement>({
    box: 'border-box',
    round: linear,
  })

  useEffect(() => {
    dispatch(setOptionSize({ size: { width, height }, optionId }))
  }, [width, height, dispatch, optionId])

  return (
    <th ref={ref} className="relative z-10">
      <div className={classNames(styles.TitleGroup, 'group relative')}>
        <OptionTitle optionId={optionId} />
        <OptionActions optionId={optionId} />
      </div>
    </th>
  )
})
