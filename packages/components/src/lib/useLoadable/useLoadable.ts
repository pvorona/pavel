import { isFunction } from 'lodash'
import { useEffect, useState } from 'react'

type LoadedState<T> = { status: 'completed'; data: T }
type FailedState<E> = { status: 'failed'; error: E }

type Loadable<T, E = unknown> =
  | { status: 'idle' }
  | { status: 'loading' }
  | LoadedState<T>
  | FailedState<E>

const IDLE = { status: 'idle' } as const
const LOADING = { status: 'loading' } as const

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

        setState({ status: 'completed', data })
      } catch (error) {
        setState({ status: 'failed', error })
      }
    }

    performWork()
  }, [load])

  return state
}

export function isFailed<E>(loadable: Loadable<E>): loadable is FailedState<E> {
  return loadable.status === 'failed'
}

export function isLoaded<T>(loadable: Loadable<T>): loadable is LoadedState<T> {
  return loadable.status === 'completed'
}
export function isSettled<T, E>(
  loadable: Loadable<T, E>,
): loadable is LoadedState<T> | FailedState<E> {
  return isFailed(loadable) || isLoaded(loadable)
}
