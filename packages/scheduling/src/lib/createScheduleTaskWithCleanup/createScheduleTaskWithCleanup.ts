import { Lambda } from '../types'
import { PHASE, PRIORITY } from '../constants'
import { scheduleTask } from '../scheduleTask'
import { phase } from '../scheduling'

export function createScheduleTaskWithCleanup(
  task: Lambda,
  priority?: PRIORITY,
): Lambda {
  let cancelTask: undefined | Lambda

  return function scheduleTaskAndCleanUpIfNeeded() {
    // Only cancel if
    // 1. was not executed
    // 2. phase is rendering
    if (cancelTask && phase !== PHASE.RENDERING) {
      cancelTask()
    }

    cancelTask = scheduleTask(task, priority)
  }
}
