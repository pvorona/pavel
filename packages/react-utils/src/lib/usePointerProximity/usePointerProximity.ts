import { observe, pointerPosition } from '@pavel/observable'
import { getDistance2DBetweenPointAndRectangle } from '@pavel/utils'
import { useState, useEffect } from 'react'

export function usePointerProximity({
  threshold = 5,
}: { threshold?: number } = {}) {
  const [element, setElement] = useState<HTMLElement>()
  const [isCloseToElement, setIsCloseToElement] = useState(false)

  useEffect(() => {
    if (element === undefined) {
      return
    }

    return observe(
      [pointerPosition],
      ({ x, y }) => {
        const { left, top, right, bottom } = element.getBoundingClientRect()
        const distance = getDistance2DBetweenPointAndRectangle([x, y], {
          left,
          top,
          right,
          bottom,
        })
        setIsCloseToElement(distance <= threshold)
      },
      { fireImmediately: false },
    )
  }, [element, threshold])

  return [isCloseToElement, setElement] as const
}
