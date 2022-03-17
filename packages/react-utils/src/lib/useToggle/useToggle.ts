import { isUndefined } from 'lodash'
import { useState, useCallback } from 'react'

export default function useToggle(initialState = false) {
  const [state, setState] = useState(initialState)

  const toggle = useCallback((maybeValue?: boolean) => {
    if (isUndefined(maybeValue)) {
      setState(value => !value)
    } else {
      setState(maybeValue)
    }
  }, [])

  return [state, toggle]
}
