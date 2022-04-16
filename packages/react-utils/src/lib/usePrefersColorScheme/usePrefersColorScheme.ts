import { isBrowser } from '@pavel/utils'
import { useState, useEffect } from 'react'

const query = isBrowser
  ? matchMedia('(prefers-color-scheme: dark)')
  : { matches: false }

export function usePrefersColorScheme() {
  const [isDark, setIsDark] = useState(query.matches)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setIsDark(event.matches)
    }

    ;(query as MediaQueryList).addEventListener('change', onChange)

    return () => {
      ;(query as MediaQueryList).removeEventListener('change', onChange)
    }
  }, [])

  return isDark
}
