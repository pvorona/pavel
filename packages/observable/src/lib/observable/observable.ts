import { EagerSubject, Identifiable } from '../types'
import { createId } from '../createId'
import { createObservers } from '@pavel/utils'
import { Setter, Getter } from '@pavel/types'

type InterceptorOptions<T> = {
  get: (target: { set: Setter<T>; get: Getter<T> }) => T
  set: (value: T, target: { set: Setter<T>; get: Getter<T> }) => void
}

export type ObservableOptions<T> = Partial<
  Readonly<
    Identifiable & InterceptorOptions<T> & { is: (a: T, b: T) => boolean }
  >
>

const OBSERVABLE_GROUP = 'Observable'

// export function createObservable<T>(
export function observable<T>(
  initialValue: T,
  options?: ObservableOptions<T>,
): EagerSubject<T> {
  const is = options?.is ?? Object.is
  const observers = createObservers<[T]>()
  const id = createId(OBSERVABLE_GROUP, options)

  let value = initialValue

  function get() {
    return value
  }

  function set(newValue: T) {
    value = newValue

    notify()
  }

  // function update(updater: (value: T) => T) {}

  // function mutate() {}

  function notify() {
    observers.notify(value)
  }

  function defaultSet(newValue: T) {
    if (is(value, newValue)) {
      return
    }

    set(newValue)
  }

  const publicGet = (() => {
    if (options?.get) {
      const interceptGet = options.get

      return () => interceptGet({ get, set })
    }

    return get
  })()

  const publicSet = (() => {
    if (options?.set) {
      const interceptSet = options.set

      return (newValue: T) => interceptSet(newValue, { get, set })
    }

    return defaultSet
  })()

  return {
    id,
    get: publicGet,
    set: publicSet,
    observe: observers.register,
  }
}
