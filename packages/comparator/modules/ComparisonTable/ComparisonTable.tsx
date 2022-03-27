import React, { memo, useEffect, useRef } from 'react'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import useResizeObserver from 'use-resize-observer'
import { useDispatch, useSelector } from 'react-redux'
import {
  setLeftBlockHovered,
  setRightBlockHovered,
  setTableSize,
} from './comparisonTable.slice'
import { effect, windowWidth } from '@pavel/observable'
import {
  addOptionToCurrentComparison,
  selectCurrentComparisonOptionIds,
} from '../comparisons'
import { useAuthUser, withAuthUser } from 'next-firebase-auth'
import classNames from 'classnames'
import styles from './ComparisonTable.module.scss'

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
    <div className="w-full mt-2 flex">
      <LeftHoverBlock />
      <table ref={ref} className="min-w-[640px] mx-auto relative">
        <thead>
          <tr className={classNames('sticky top-0 z-20', styles['Header'])}>
            <TableHeader />
            <th
              ref={separatorRef}
              className={classNames(
                'h-[1px] absolute bottom-0 p-0',
                styles['HeaderSeparator'],
              )}
            />
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
      <RightHoverBlock />
    </div>
  )
})

const LeftHoverBlock = withAuthUser()(function LeftHoverBlock() {
  const user = useAuthUser()
  const dispatch = useDispatch()

  function onClick() {
    dispatch(addOptionToCurrentComparison({ ownerId: user.id, index: 0 }))
  }

  function onMouseEnter() {
    dispatch(setLeftBlockHovered(true))
  }

  function onMouseLeave() {
    dispatch(setLeftBlockHovered(false))
  }

  return (
    <HoverBlock
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
})

const RightHoverBlock = withAuthUser()(function RightHoverBlock() {
  const user = useAuthUser()
  const dispatch = useDispatch()
  const optionIds = useSelector(selectCurrentComparisonOptionIds)

  function onClick() {
    dispatch(
      addOptionToCurrentComparison({
        ownerId: user.id,
        index: optionIds.length,
      }),
    )
  }

  function onMouseEnter() {
    dispatch(setRightBlockHovered(true))
  }

  function onMouseLeave() {
    dispatch(setRightBlockHovered(false))
  }

  return (
    <HoverBlock
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
})

function HoverBlock(props) {
  return <div className="flex-grow cursor-pointer" {...props} />
}
