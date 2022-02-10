import { PRIORITY } from '../constants'
import { queueByPriority, scheduleExecutionIfNeeded } from '../scheduling'
import { Lambda } from '../types'

export function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
  // Capture queue of the current frame
  // to prevent modifications of the future queues
  // when cancelling this task
  const { isCancelledByIndex, tasks } = queueByPriority[priority]
  const nextIndex = tasks.push(task)

  // if (phase === PHASE.INTERACTING) {
  scheduleExecutionIfNeeded()
  // }

  return function cancelTask() {
    isCancelledByIndex[nextIndex - 1] = true
  }
}

export function oncePerFrame(fn: Lambda, priority = PRIORITY.WRITE): Lambda {
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
