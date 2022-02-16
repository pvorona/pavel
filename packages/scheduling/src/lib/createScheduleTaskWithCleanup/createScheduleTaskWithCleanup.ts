import { Lambda } from '@pavel/types'
import { PRIORITY } from '../constants'
import { scheduleTask } from '../scheduleTask'

export function createScheduleTaskWithCleanup(
  task: Lambda,
  priority?: PRIORITY,
): Lambda {
  let cancelTask: undefined | Lambda

  return function scheduleTaskAndCleanUpIfNeeded() {
    if (cancelTask) {
      cancelTask()
    }

    cancelTask = scheduleTask(task, priority)
  }
}
