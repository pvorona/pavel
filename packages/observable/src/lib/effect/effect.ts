import { Lambda, ObservedTypesOf, ReadonlySubject } from '../types'
import { throttleWithFrame } from '@pavel/scheduling'
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
  observer: (...args: ObservedTypesOf<T>) => void,
  options = DEFAULT_OPTIONS,
): Lambda {
  const scheduleNotifyWithCleanup = throttleWithFrame(
    function performEffect() {
      observer(...collectValues(deps))
    },
  )

  return observe(deps, scheduleNotifyWithCleanup, {
    collectValues: false,
    ...options,
  })
}
