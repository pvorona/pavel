import { swapElements } from '@pavel/utils'
import {
  BEFORE_RENDER_PRIORITIES_IN_ORDER,
  PHASE,
  RENDER_PRIORITIES_IN_ORDER,
  PRIORITIES_IN_ORDER,
  PRIORITY,
} from '../constants'
import { initQueue } from './initQueue'
import { Lambda } from '@pavel/types'
import { requestIdleCallback, cancelIdleCallback } from '@pavel/utils'

function createTaskQueue() {
  let animationFrameId: undefined | number = undefined
  let idleCallbackId: undefined | number = undefined
  let phase = PHASE.INTERACTING

  const currentFrameQueueByPriority = initQueue()
  const nextFrameQueueByPriority = initQueue()

  function scheduleIdleCallbackIfNeeded() {
    if (idleCallbackId !== undefined) {
      return
    }

    idleCallbackId = requestIdleCallback(performIdleTasks)
  }

  function performIdleTasks(deadline: IdleDeadline) {
    idleCallbackId = undefined

    for (const priority of BEFORE_RENDER_PRIORITIES_IN_ORDER) {
      const queue = currentFrameQueueByPriority[priority]

      while (deadline.timeRemaining() > 0 && !queue.isEmpty) {
        const task = queue.dequeue()

        task()
      }
    }
    // Make sure frame is scheduled/cancelled if needed
  }

  function scheduleExecutionIfNeeded() {
    if (animationFrameId !== undefined) {
      return
    }

    animationFrameId = requestAnimationFrame(performScheduledTasks)
  }

  // function performScheduledTasks(timestamp: number) {
  function performScheduledTasks() {
    if (idleCallbackId !== undefined) {
      cancelIdleCallback(idleCallbackId)

      idleCallbackId = undefined
    }

    // If we were not able to run before raf we run it here
    // before moving to rendering phase
    for (const priority of BEFORE_RENDER_PRIORITIES_IN_ORDER) {
      for (const task of currentFrameQueueByPriority[priority]) {
        task()
      }
    }

    phase = PHASE.RENDERING

    for (const priority of RENDER_PRIORITIES_IN_ORDER) {
      for (const task of currentFrameQueueByPriority[priority]) {
        // task(timestamp)
        task()
      }
    }

    // Should be cleared before calling `schedulePerformWorkIfNeeded`
    animationFrameId = undefined

    let anyTaskScheduledDuringRendering = false

    for (const priority of PRIORITIES_IN_ORDER) {
      if (!nextFrameQueueByPriority[priority].isEmpty) {
        anyTaskScheduledDuringRendering = true
        // No need to create new queue
        // Current frame queue already re-initialized
        swapElements(
          currentFrameQueueByPriority,
          priority,
          nextFrameQueueByPriority,
          priority,
        )
      }
    }

    // Make sure correct execution is scheduled
    if (anyTaskScheduledDuringRendering) {
      scheduleExecutionIfNeeded()
    }

    phase = PHASE.INTERACTING
  }

  function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
    // Capture queue of the current frame
    // to prevent modifications of the future queues
    // when cancelling this task
    const queue = getQueue(priority)[priority]
    const node = queue.enqueue(task)

    // Make sure correct execution is scheduled
    if (priority === PRIORITY.BEFORE_RENDER) {
      scheduleIdleCallbackIfNeeded()
    }

    // Make sure correct execution is scheduled
    scheduleExecutionIfNeeded()

    return function cancelTask() {
      queue.removeNode(node)
    }
  }

  function getQueue(priority: PRIORITY) {
    if (priority === PRIORITY.BEFORE_RENDER && phase === PHASE.RENDERING) {
      return nextFrameQueueByPriority
    }

    return currentFrameQueueByPriority
  }

  return { scheduleTask }
}

export const { scheduleTask } = createTaskQueue()
