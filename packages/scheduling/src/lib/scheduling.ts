import { swapElements } from '@pavel/swapElements'
import { QueueByPriority } from './types'
import {
  BEFORE_RENDER_PRIORITIES_IN_ORDER,
  PHASE,
  RENDER_PRIORITIES_IN_ORDER,
} from './constants'
import { createQueue } from './createQueue'
import { initQueue } from './initQueue'
import { PRIORITY } from '.'

let animationFrameId: undefined | number = undefined
// let idleCallbackId: undefined | number = undefined
export let phase = PHASE.INTERACTING

export const queueByPriority: QueueByPriority = initQueue()
export const futureQueueByPriority: QueueByPriority = initQueue()

Object.assign(window, { queueByPriority, futureQueueByPriority })

export function scheduleExecutionIfNeeded() {
  if (animationFrameId !== undefined) return

  animationFrameId = requestAnimationFrame(performScheduledTasks)
}

function performScheduledTasks() {
  console.log('START------------------')

  phase = PHASE.BEFORE_RENDER

  for (const priority of BEFORE_RENDER_PRIORITIES_IN_ORDER) {
    executeTasksAndReinitializeQueueIfNeeded(queueByPriority, priority)
  }

  phase = PHASE.RENDERING

  for (const priority of RENDER_PRIORITIES_IN_ORDER) {
    executeTasksAndReinitializeQueueIfNeeded(queueByPriority, priority)
  }

  // Should be cleared before calling `schedulePerformWorkIfNeeded`
  animationFrameId = undefined

  let anyTaskScheduledDuringRendering = false

  for (const priority of RENDER_PRIORITIES_IN_ORDER) {
    // TODO: Check if not all cancelled
    if (futureQueueByPriority[priority].tasks.length !== 0) {
      anyTaskScheduledDuringRendering = true
      // No need to create new queue
      // Current frame queue already re-initialized
      swapElements(queueByPriority, priority, futureQueueByPriority, priority)
    }
  }

  if (anyTaskScheduledDuringRendering) {
    scheduleExecutionIfNeeded()
  }

  phase = PHASE.INTERACTING

  console.log('------------------END')
}

function executeTasksAndReinitializeQueueIfNeeded(
  queue: QueueByPriority,
  priority: PRIORITY,
) {
  const { tasks, isCancelledByIndex } = queue[priority]

  for (let i = 0; i < tasks.length; i++) {
    if (isCancelledByIndex[i]) {
      continue
    }

    tasks[i]()
  }

  if (tasks.length !== 0) {
    queue[priority] = createQueue()
  }
}
