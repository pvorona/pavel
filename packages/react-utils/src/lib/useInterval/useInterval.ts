import { Lambda } from '@pavel/types'
import { noop } from '@pavel/utils'
import { useEffect, useRef } from 'react'

export function useInterval(callback: Lambda, interval: number) {
  const savedCallback = useRef<Lambda>(noop)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    const id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [interval])
}
