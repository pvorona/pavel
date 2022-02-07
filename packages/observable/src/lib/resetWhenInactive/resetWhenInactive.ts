import { EagerObservable, Gettable, Settable } from '../types'

type Options<T> = {
  delay: number
  value?: T
}

export const resetWhenInactive =
  <T>({ delay, value: valueFromOptions }: Options<T>) =>
  (
    target: EagerObservable<T> & Gettable<T> & Settable<T>,
  ): EagerObservable<T> & Gettable<T> & Settable<T> => {
    const value = valueFromOptions ?? target.get()

    let timeoutId: undefined | number

    function reset() {
      target.set(value)
    }

    return {
      set(newValueOrFactory: T | ((prevValue: T) => T)) {
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
