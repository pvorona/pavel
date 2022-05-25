import { Lambda } from '@pavel/types'
import { scheduleTask } from '../taskQueue'
import { PRIORITY } from '../constants'

export function throttleTask(fn: Lambda, priority = PRIORITY.WRITE): Lambda {
  let scheduled = false

  return function scheduleThrottledTask() {
    if (scheduled) {
      return
    }

    scheduled = true

    scheduleTask(function executeScheduledTask() {
      fn()
      scheduled = false
    }, priority)
  }
}
