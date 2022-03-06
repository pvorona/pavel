import React, { memo, useEffect } from 'react'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import useResizeObserver from 'use-resize-observer'
import { useDispatch } from 'react-redux'
import { setTableSize } from './comparisonTable.slice'

export const ComparisonTable = memo(function ComparisonTable() {
  const dispatch = useDispatch()
  const { ref, width, height } = useResizeObserver<HTMLTableElement>()

  useEffect(() => {
    dispatch(setTableSize({ width, height }))
  }, [width, height, dispatch])

  return (
    <div className="w-full">
      <table ref={ref} className="min-w-[640px] mb-16 mx-auto relative">
        <thead>
          <tr
            className={'sticky top-0 z-20 bg-white dark:bg-[#202124]'}
            style={{
              backgroundImage:
                'linear-gradient(to top, hsl(0deg 0% 0% / 10%) 1px, transparent 0)',
            }}
          >
            <TableHeader />
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </div>
  )
})
