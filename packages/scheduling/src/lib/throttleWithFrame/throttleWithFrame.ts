import { Lambda } from '@pavel/types'
import { scheduleTask } from '../taskQueue'
import { PRIORITY } from '../constants'

export function throttleWithFrame(
  fn: Lambda,
  priority = PRIORITY.WRITE,
): Lambda {
  let scheduled = false

  return function wrappedOncePerFrame() {
    if (scheduled) {
      return
    }

    scheduled = true

    scheduleTask(() => {
      fn()
      scheduled = false
    }, priority)
  }
}
