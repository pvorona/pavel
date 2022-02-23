import { createName, wrapName } from '../createName'
import { EagerSubject, Named } from '../types'

type ResetWhenInactiveOptions =
  | ({
      delay: number
    } & Partial<Named>)
  | number

const RESET_WHEN_INACTIVE_GROUP = 'ResetWhenInactive'

// Interceptor with read/write hooks
export const resetWhenInactive =
  (options: ResetWhenInactiveOptions) =>
  <T>(target: EagerSubject<T>): EagerSubject<T> => {
    const name = wrapName(
      createName(RESET_WHEN_INACTIVE_GROUP, options),
      target.name,
    )
    const delay = getDelay(options)
    const initialValue = target.value

    let timeoutId: undefined | number

    function reset() {
      target.value = initialValue
    }

    return {
      name,
      set value(newValue) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        timeoutId = window.setTimeout(reset, delay)

        target.value = newValue
      },
      get value() {
        return target.value
      },
      observe: target.observe,
    }
  }

function getDelay(optionsOrDelay: ResetWhenInactiveOptions): number {
  return typeof optionsOrDelay === 'number'
    ? optionsOrDelay
    : optionsOrDelay.delay
}
