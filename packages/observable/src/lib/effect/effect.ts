import { Lambda } from '@pavel/types'
import { ObservedTypesOf, ReadonlySubject } from '../types'
import { throttleTask } from '@pavel/scheduling'
import { collectValues } from '../utils'
import { observe } from '../observe'

type Options = {
  readonly fireImmediately?: boolean
}

const DEFAULT_OPTIONS: Options = {
  fireImmediately: true,
}

export function effect<T extends ReadonlySubject<unknown>[]>(
  deps: readonly [...T],
  observer: (...args: ObservedTypesOf<T>) => void | Lambda,
  options = DEFAULT_OPTIONS,
): Lambda {
  let effectCleanup: void | Lambda

  const scheduleNotification = throttleTask(function performEffect() {
    if (effectCleanup) {
      effectCleanup()
    }

    effectCleanup = observer(...collectValues(deps))
  })

  return observe(deps, scheduleNotification, {
    collectValues: false,
    ...options,
  })
}
