import { Observer, EagerSubject, Named } from '../types'
import { createName } from '../createName'
import { createObservers } from '@pavel/utils'
import { isObject } from '@pavel/assert'
import { Lambda, RecordKey } from '@pavel/types'

export type ObservableOptions = Partial<Named>

const OBSERVABLE_GROUP = 'Observable'

export const proxyToRawMap = new WeakMap()
export const rawToProxyMap = new WeakMap()

export function isProxy<T extends Record<RecordKey, unknown>>(value: T) {
  return proxyToRawMap.has(value)
}

export function hasCorrespondingProxy<T extends Record<RecordKey, unknown>>(
  thing: T,
) {
  return rawToProxyMap.has(thing)
}

export function getProxyFor<T extends Record<RecordKey, unknown>>(thing: T) {
  return rawToProxyMap.get(thing)
}

export function getRawForProxy<T extends Record<RecordKey, unknown>>(proxy: T) {
  return proxyToRawMap.get(proxy)
}

export function reactive<T>(target: T, notify: Lambda): T {
  // Don't instrument primitives
  if (!isObject(target)) {
    return target
  }

  if (isProxy(target)) {
    return target
  }

  // For the same input return the same proxy
  if (hasCorrespondingProxy(target)) {
    return getProxyFor(target)
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)

      return reactive(result, notify)
    },
    set(target, key, valueOrProxy, receiver) {
      const value = isProxy(valueOrProxy)
        ? getRawForProxy(valueOrProxy)
        : valueOrProxy

      const oldValue = Reflect.get(target, key, receiver)

      // Don't trigger updates when setting the same value
      if (Object.is(oldValue, value)) {
        return true
      }

      const result = Reflect.set(target, key, value, receiver)

      notify()

      return result
    },
    deleteProperty(target, key) {
      const hasPropertyExisted = Reflect.has(target, key)
      const result = Reflect.deleteProperty(target, key)

      // Only notify observers
      if (result && hasPropertyExisted) {
        notify()
      }

      return result
    },
  })

  proxyToRawMap.set(proxy, target)
  rawToProxyMap.set(target, proxy)

  return proxy as unknown as T
}

export function observable<T>(
  initialValue: T,
  options?: ObservableOptions,
): EagerSubject<T> {
  const observers = createObservers<[T]>()
  const name = createName(OBSERVABLE_GROUP, options)

  let rawValue = initialValue
  let reactiveValue = reactive(rawValue, notify)

  function notify() {
    observers.notify(reactiveValue)
  }

  return {
    name,
    get value() {
      return reactiveValue
    },
    set value(newValue: T) {
      if (Object.is(rawValue, newValue)) {
        return
      }

      rawValue = newValue
      reactiveValue = reactive(rawValue, notify)

      notify()
    },
    observe: observers.register,
  }
}
