import { useDispatch, useSelector } from 'react-redux'
import {
  SCALE,
  selectScale,
  selectTranslateX,
  selectTranslateY,
  setScale,
  shiftByX,
  shiftByY,
} from '../../modules'
import { useEffect, useRef, useState } from 'react'
import { Tree } from '../Tree'
import classNames from 'classnames'
import { handleDrag } from '@pavel/utils'

export function MindMapView() {
  const scale = useSelector(selectScale)
  const translateX = useSelector(selectTranslateX)
  const translateY = useSelector(selectTranslateY)
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const dragStateRef = useRef({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (!element) {
      return
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      const { deltaY, deltaX } = event
      const change = -(deltaY + deltaX) / SCALE.WHEEL_FRICTION

      dispatch(setScale(scale + change))
    }

    element.addEventListener('wheel', handleWheel)

    return () => {
      element.removeEventListener('wheel', handleWheel)
    }
  }, [dispatch, element, scale])

  useEffect(() => {
    if (!element) {
      return
    }

    return handleDrag(element, {
      onDragStart: event => {
        setIsDragging(true)
        dragStateRef.current.x = event.clientX
        dragStateRef.current.y = event.clientY
      },
      onDragMove: event => {
        const newTranslateX = event.clientX - dragStateRef.current.x
        const newTranslateY = event.clientY - dragStateRef.current.y

        dragStateRef.current.x = event.clientX
        dragStateRef.current.y = event.clientY

        dispatch(shiftByX(newTranslateX))
        dispatch(shiftByY(newTranslateY))
      },
      onDragEnd: () => {
        setIsDragging(false)
      },
    })
  }, [dispatch, element])

  return (
    <div
      className={classNames('w-full h-full flex items-center justify-center', {
        'cursor-grab': !isDragging,
        'cursor-grabbing': isDragging,
      })}
      ref={setElement}
    >
      <div
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            transform: `translate(${translateX}px, ${translateY}px)`,
          }}
        >
          <Tree />
        </div>
      </div>
    </div>
  )
}
