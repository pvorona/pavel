import { Lambda, Gettable, Observable, ObservedTypesOf } from '../types'
import { createScheduleTaskWithCleanup } from '@pavel/scheduling'
import { collectValues } from '../utils'
import { observe } from '../observe'

type Options = {
  readonly fireImmediately?: boolean
}

const DEFAULT_OPTIONS: Options = {
  fireImmediately: true,
}

export function effect<T extends (Observable<unknown> & Gettable<unknown>)[]>(
  deps: readonly [...T],
  observer: (...args: ObservedTypesOf<T>) => void,
  options = DEFAULT_OPTIONS,
): Lambda {
  const scheduleNotifyWithCleanup = createScheduleTaskWithCleanup(
    function performEffect() {
      observer(...collectValues(deps))
    },
  )

  return observe(deps, scheduleNotifyWithCleanup, {
    collectValues: false,
    ...options,
  })
}
