import { isFunction } from '@pavel/assert'
import { useEffect, useState } from 'react'

type SuccessState<T> = { status: 'success'; data: T }
type FailureState<E> = { status: 'failure'; error: E }

type Loadable<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | SuccessState<T>
  | FailureState<E>

const IDLE = { status: 'idle' } as const
const LOADING = { status: 'loading' } as const

// Cancel on unmount
export function useLoadable<T>(load: false | (() => Promise<T>)): Loadable<T> {
  const [state, setState] = useState<Loadable<T>>(IDLE)

  useEffect(() => {
    async function performWork() {
      if (!isFunction(load)) {
        return
      }

      setState(LOADING)

      try {
        const data = await load()

        setState({ status: 'success', data })
      } catch (error) {
        setState({ status: 'failure', error: error as Error })
      }
    }

    performWork()
  }, [load])

  return state
}

export function isFailed<E extends Error = Error>(
  loadable: Loadable<unknown>,
): loadable is FailureState<E> {
  return loadable.status === 'failure'
}

export function isLoaded<T>(
  loadable: Loadable<T>,
): loadable is SuccessState<T> {
  return loadable.status === 'success'
}
export function isSettled<T, E extends Error = Error>(
  loadable: Loadable<T, E>,
): loadable is SuccessState<T> | FailureState<E> {
  return isFailed(loadable) || isLoaded(loadable)
}
