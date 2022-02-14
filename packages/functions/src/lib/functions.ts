import { Lambda } from '@pavel/types'
import { invokeAll, removeFirstElementOccurrence } from '@pavel/utils'

export function createFunctions<T extends (...args: never[]) => void>() {
  const functions: T[] = []

  function add(fn: T): Lambda {
    functions.push(fn)

    return () => {
      removeFirstElementOccurrence(functions, fn)
    }
  }

  function invoke(...args: Parameters<T>) {
    invokeAll(functions, ...args)
  }

  return { add, invoke }
}
