import { EagerObservable, Gettable, Settable } from '../types'

type Options = {
  delay: number
}

export const resetWhenInactive =
  (options: Options) =>
  <T>(
    target: EagerObservable<T> & Gettable<T> & Settable<T>,
  ): EagerObservable<T> & Gettable<T> & Settable<T> => {
    const { delay } = options
    const initialValue = target.get()

    let timeoutId: undefined | number

    function reset() {
      target.set(initialValue)
    }

    return {
      set(newValueOrFactory) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        timeoutId = window.setTimeout(reset, delay)

        target.set(newValueOrFactory)
      },
      get: target.get,
      observe: target.observe,
    }
  }
