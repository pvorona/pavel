import React, { memo, useEffect, useRef } from 'react'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import useResizeObserver from 'use-resize-observer'
import { useDispatch } from 'react-redux'
import { setTableSize } from './comparisonTable.slice'
import { effect, windowWidth } from '@pavel/observable'

export const ComparisonTable = memo(function ComparisonTable() {
  const dispatch = useDispatch()
  const { ref, width, height } = useResizeObserver<HTMLTableElement>()
  const separatorRef = useRef<HTMLTableCellElement | undefined>()

  useEffect(() => {
    dispatch(setTableSize({ width, height }))
  }, [width, height, dispatch])

  useEffect(() => {
    return effect([windowWidth], windowWidth => {
      if (!separatorRef.current) {
        return
      }

      if (windowWidth < width) {
        separatorRef.current.style.left = `0`
        separatorRef.current.style.right = `0`
      } else {
        const offset = `${-(windowWidth - width) / 2}px`

        separatorRef.current.style.left = offset
        separatorRef.current.style.right = offset
      }
    })
  }, [width])

  return (
    <div className="w-full">
      <table ref={ref} className="min-w-[640px] mb-16 mx-auto relative">
        <thead>
          <tr className="sticky top-0 z-20 bg-white dark:bg-gray-6">
            <TableHeader />
            <th
              ref={separatorRef}
              className="h-[1px] absolute bottom-0 bg-gray-5 dark:bg-gray-3"
            />
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </div>
  )
})
