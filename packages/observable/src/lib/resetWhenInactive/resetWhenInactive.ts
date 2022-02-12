import { createName, wrapName } from '../createName'
import { EagerSubject, Named } from '../types'

type ResetWhenInactiveOptions =
  | ({
      delay: number
    } & Partial<Named>)
  | number

const RESET_WHEN_INACTIVE_GROUP = 'ResetWhenInactive'

export const resetWhenInactive =
  (options: ResetWhenInactiveOptions) =>
  <T>(target: EagerSubject<T>): EagerSubject<T> => {
    const name = wrapName(
      createName(RESET_WHEN_INACTIVE_GROUP, options),
      target.name,
    )
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
