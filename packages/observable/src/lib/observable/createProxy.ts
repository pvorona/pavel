import { isObject } from '@pavel/assert'
import { Lambda } from '@pavel/types'
import {
  getProxyFor,
  getRawForProxy,
  hasCorrespondingProxy,
  isProxy,
  setProxyForRaw,
  setRawForProxy,
} from '../internal'

export function createProxy<T>(target: T, notify: Lambda): T {
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

      return createProxy(result, notify)
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

      // Only notify observers if deleted property existed
      if (result && hasPropertyExisted) {
        notify()
      }

      return result
    },
  })

  setRawForProxy(proxy, target)
  setProxyForRaw(target, proxy)

  return proxy as unknown as T
}
