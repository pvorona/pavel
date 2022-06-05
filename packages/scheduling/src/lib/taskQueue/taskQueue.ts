import {
  IDLE_PRIORITIES_IN_ORDER,
  RENDER_PRIORITIES_IN_ORDER,
  PRIORITY,
} from '../constants'
import { initQueue } from './initQueue'
import { Lambda } from '@pavel/types'
import { requestIdleCallback, cancelIdleCallback } from '@pavel/utils'

function createTaskQueue() {
  let animationFrameId: undefined | number = undefined
  let idleCallbackId: undefined | number = undefined
  let currentFrameTimestamp: undefined | DOMHighResTimeStamp = undefined
  let currentFrameQueueByPriority = initQueue()

  function scheduleIdleCallbackIfNeeded() {
    if (idleCallbackId !== undefined) {
      return
    }

    idleCallbackId = requestIdleCallback(performIdleTasks)
  }

  function scheduleAnimationFrameIfNeeded() {
    if (animationFrameId !== undefined) {
      return
    }

    animationFrameId = requestAnimationFrame(performFrameTasks)
  }

  function performIdleTasks(deadline: IdleDeadline) {
    idleCallbackId = undefined

    for (const priority of IDLE_PRIORITIES_IN_ORDER) {
      const queue = currentFrameQueueByPriority[priority]

      while (deadline.timeRemaining() > 0 && !queue.isEmpty) {
        const task = queue.dequeue()

        task()
      }
    }

    // Make sure frame is scheduled/cancelled if needed
    for (const priority of IDLE_PRIORITIES_IN_ORDER) {
      const queue = currentFrameQueueByPriority[priority]

      if (!queue.isEmpty) {
        scheduleAnimationFrameIfNeeded()

        break
      }
    }
  }

  function performFrameTasks(timestamp: DOMHighResTimeStamp) {
    // We were not able to run idle tasks before the next frame
    // Let's run them now before frame tasks
    if (idleCallbackId !== undefined) {
      cancelIdleCallback(idleCallbackId)

      idleCallbackId = undefined
    }

    // Idle tasks can still be in the queue
    // If they didn't have enough time to run during idle time
    for (const priority of IDLE_PRIORITIES_IN_ORDER) {
      for (const task of currentFrameQueueByPriority[priority]) {
        task()
      }
    }

    currentFrameTimestamp = timestamp
    // Should be cleared before calling `scheduleAnimationFrameIfNeeded`
    // Clear frameId so that scheduling new tasks will schedule respective callbacks
    animationFrameId = undefined
    // Capture current queue
    const queue = currentFrameQueueByPriority
    // Reinitialize queue
    // So that new tasks are added to the next frame queue
    currentFrameQueueByPriority = initQueue()

    for (const priority of RENDER_PRIORITIES_IN_ORDER) {
      for (const task of queue[priority]) {
        task()
      }
    }

    currentFrameTimestamp = undefined
  }

  function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
    // Capture queue of the current frame
    // to prevent modifications of the future queues
    // when cancelling this task
    const queue = currentFrameQueueByPriority[priority]
    const node = queue.enqueue(task)

    // Make sure correct execution is scheduled
    if (priority === PRIORITY.BEFORE_RENDER) {
      scheduleIdleCallbackIfNeeded()
    } else {
      scheduleAnimationFrameIfNeeded()
    }

    return function cancelTask() {
      queue.removeNode(node)
    }
  }

  function getCurrentFrameTimestamp(): DOMHighResTimeStamp | undefined {
    return currentFrameTimestamp
  }

  return { scheduleTask, getCurrentFrameTimestamp }
}

export const { scheduleTask, getCurrentFrameTimestamp } = createTaskQueue()
