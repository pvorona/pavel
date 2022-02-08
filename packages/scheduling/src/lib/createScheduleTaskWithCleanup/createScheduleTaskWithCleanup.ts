import { Lambda } from '../types'
import { PRIORITY, URGENCY } from '../constants'
import { scheduleTask } from '../scheduleTask'

export function createScheduleTaskWithCleanup(
  task: Lambda,
  priority?: PRIORITY,
  urgency = URGENCY.CURRENT_FRAME,
): Lambda {
  let cancelTask: undefined | Lambda

  return function scheduleTaskAndCleanUpIfNeeded() {
    if (cancelTask) {
      cancelTask()
    }

    cancelTask = scheduleTask(task, priority, urgency)
  }
}
