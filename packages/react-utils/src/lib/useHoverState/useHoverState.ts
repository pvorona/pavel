import { useState, useCallback, useEffect } from 'react'

export function useHover() {
  const [isHovered, setIsHovered] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const onMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  useEffect(() => {
    if (!element) {
      return
    }
    element.addEventListener('mouseenter', onMouseEnter, { capture: true })
    element.addEventListener('mouseleave', onMouseLeave, { capture: true })

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter)
      element.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [element, onMouseEnter, onMouseLeave])

  return { isHovered, ref: setElement }
}
