import { Lambda, LazyObservable, Gettable, Observable } from '../types'
import { Transition } from '../transition'
import {
  createScheduleTaskWithCleanup,
  PRIORITY,
  URGENCY,
} from '@pavel/scheduling'
import { notifyAll, removeFirstElementOccurrence } from '../utils'

export function animationObservable<T>(
  innerObservable: Observable<T> & Gettable<T>,
  initialTransition: Transition<T>,
): LazyObservable &
  Gettable<T> & { setTransition: (transition: Transition<T>) => void } {
  const observers: Lambda[] = []
  let transition = initialTransition
  let state = transition.getState()

  function notify() {
    notifyAll(observers)
  }

  const scheduleNotifyWithCleanup = createScheduleTaskWithCleanup(
    notify,
    PRIORITY.COMPUTE,
    URGENCY.NEXT_FRAME,
  )

  const get = () => {
    const newState = transition.getState()
    if (state !== newState) {
      state = newState
    }

    if (!transition.isFinished()) {
      // if phase is rendering
      // execute notify task in next frame
      // else notify
      scheduleNotifyWithCleanup()
    }

    return state
  }

  const set = (t?: T) => {
    // need better check if lazy
    const target = t ? t : innerObservable.get()
    // might need cancel task here
    // if (futureTask && !futureTask.cancelled) {
    //   cancelTask(futureTask)
    // }
    transition.setTarget(target)

    // If transition is in progress
    // Update to the latest value before setting new target
    // for smoother animations
    if (!transition.isFinished()) {
      notify()
    }
  }

  innerObservable.observe(set)

  return {
    get,
    observe(observer) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
    setTransition(newTransition) {
      newTransition.setTarget(transition.getTarget())
      transition = newTransition
    },
  }
}
