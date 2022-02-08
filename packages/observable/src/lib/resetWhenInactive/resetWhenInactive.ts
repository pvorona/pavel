import { EagerObservable, Gettable, Settable } from '../types'

type ResetWhenInactiveOptions =
  | {
      delay: number
    }
  | number

export const resetWhenInactive =
  (options: ResetWhenInactiveOptions) =>
  <T>(
    target: EagerObservable<T> & Gettable<T> & Settable<T>,
  ): EagerObservable<T> & Gettable<T> & Settable<T> => {
    const delay = getDelay(options)
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

function getDelay(optionsOrDelay: ResetWhenInactiveOptions): number {
  return typeof optionsOrDelay === 'number'
    ? optionsOrDelay
    : optionsOrDelay.delay
}
