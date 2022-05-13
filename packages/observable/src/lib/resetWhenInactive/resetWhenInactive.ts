import { createId, wrapName } from '../createName'
import { EagerSubject, Identifiable } from '../types'

type ResetWhenInactiveOptions =
  | ({
      delay: number
    } & Partial<Identifiable>)
  | number

const RESET_WHEN_INACTIVE_GROUP = 'ResetWhenInactive'

// Interceptor with read/write hooks
export const resetWhenInactive =
  (options: ResetWhenInactiveOptions) =>
  <T>(target: EagerSubject<T>): EagerSubject<T> => {
    const name = wrapName(
      createId(RESET_WHEN_INACTIVE_GROUP, options),
      target.id,
    )
    const delay = getDelay(options)
    const initialValue = target.get()

    let timeoutId: undefined | number

    function reset() {
      target.set(initialValue)
    }

    return {
      id: name,
      set(newValue) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        timeoutId = window.setTimeout(reset, delay)

        target.set(newValue)
      },
      get() {
        return target.get()
      },
      observe: target.observe,
    }
  }

function getDelay(optionsOrDelay: ResetWhenInactiveOptions): number {
  return typeof optionsOrDelay === 'number'
    ? optionsOrDelay
    : optionsOrDelay.delay
}
