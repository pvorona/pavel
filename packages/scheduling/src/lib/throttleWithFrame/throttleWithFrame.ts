import { Lambda } from '../types'
import { scheduleTask } from '../scheduleTask'
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
