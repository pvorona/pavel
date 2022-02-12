import { Lambda, ObservedTypeOf } from '../types'
import { notifyAll, removeFirstElementOccurrence } from '../utils'
import { observe } from '../observe'
import { AnimatableTarget, InertOptions, InertSubject } from './types'
import { constructTransition } from './constructTransition'
import { createName, wrapName } from '../createName'
import { PRIORITY, scheduleTask } from '@pavel/scheduling'

const INERT_GROUP = 'Inert'

export const inert =
  (options: InertOptions) =>
  <T extends AnimatableTarget>(target: T): InertSubject<ObservedTypeOf<T>> => {
    const name = wrapName(createName(INERT_GROUP, options), target.name)
    // Can get lazy. Use case for idleUntilUrgent?
    let transition = constructTransition(target.get(), options)
    const observers: Lambda[] = []
    let notificationScheduled = false

    function notifyBeforeNextRender() {
      if (name === '[[Inert#0](startIndex)]') {
        console.log(`[${performance.now()}] notify try ${name}, notificationScheduled ${notificationScheduled}`)
      }

      
      if (notificationScheduled) {
        return
      }

      notificationScheduled = true
      scheduleTask(() => {
        if (name === '[[Inert#0](startIndex)]') {
          console.log(`[${performance.now()}] notify start ${name}`)
        }

        notifyAll(observers)

        if (name === '[[Inert#0](startIndex)]') {
          console.log(`[${performance.now()}] notify end ${name}`)
        }

        notificationScheduled = false
      }, PRIORITY.BEFORE_RENDER)
    }

    const get = () => {
      // TODO: only compute value once per frame
      // TODO: compute value using requestAnimationFrame parameter instead of performance.now()
      const value = transition.getCurrentValue()

      if (name === '[[Inert#0](startIndex)]') {
        console.log(`[${performance.now()}] get ${name}, hasCompleted: ${transition.hasCompleted()}`)
      }

      
      // TODO: don't emit values when there are no observers.
      // Ensure emitting renews if new observers join while transition is in progress
      if (!transition.hasCompleted()) {
        notifyBeforeNextRender()
      }

      return value
    }

    const setTarget = (newTarget: ObservedTypeOf<T>) => {
      transition.setTargetValue(newTarget as any)

      if (!transition.hasCompleted()) {
        notifyBeforeNextRender()
      }
    }

    observe([target], setTarget as any, { fireImmediately: false })

    const setTransition = (newOptions: InertOptions) => {
      transition = constructTransition(transition.getCurrentValue(), newOptions)
    }

    return {
      name,
      setTransition,
      get: get as any,
      observe(observer) {
        observers.push(observer)

        return () => {
          removeFirstElementOccurrence(observers, observer)
        }
      },
    }
  }
