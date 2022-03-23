import { Lambda } from '@pavel/types'
import { useRef, useEffect } from 'react'

export function useOnUnload(callback: Lambda) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    function handleUnload() {
      callbackRef.current()
    }

    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('unload', handleUnload)
    }
  }, [])
}
