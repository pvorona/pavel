import { createName, wrapName } from '../createName'
import { EagerSubject } from '../types'

type ResetWhenInactiveOptions =
  | {
      delay: number
      name?: string
    }
  | number

const GROUP_NAME = 'ResetWhenInactive'

export const resetWhenInactive =
  (options: ResetWhenInactiveOptions) =>
  <T>(target: EagerSubject<T>): EagerSubject<T> => {
    const name = wrapName(createName(GROUP_NAME, options), target.name)
    const delay = getDelay(options)
    const initialValue = target.get()

    let timeoutId: undefined | number

    function reset() {
      target.set(initialValue)
    }

    return {
      name,
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
