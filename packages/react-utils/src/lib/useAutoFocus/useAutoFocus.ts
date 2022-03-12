import { useState, useEffect } from 'react'

export function useAutoFocus() {
  const [element, setElement] = useState<HTMLElement | undefined>()

  useEffect(() => {
    if (element) {
      element.focus()
    }
  }, [element])

  return setElement
}
