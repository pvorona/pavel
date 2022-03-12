import { useState, useEffect } from 'react'

export function useAutoFocus(maybeElement?: HTMLElement) {
  const [element, setElement] = useState<HTMLElement | undefined>(maybeElement)

  useEffect(() => {
    setElement(maybeElement)
  }, [maybeElement])

  useEffect(() => {
    if (element) {
      element.focus()
    }
  }, [element])

  return setElement
}
