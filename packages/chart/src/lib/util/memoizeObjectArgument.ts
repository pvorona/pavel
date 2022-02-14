import { areSameShapeObjectsShallowEqual } from '@pavel/utils'

export function memoizeObjectArgument(fun) {
  let prevObject = {}
  let prevResult

  return function memoized(object) {
    if (areSameShapeObjectsShallowEqual(object, prevObject)) {
      return prevResult
    }
    prevObject = object
    prevResult = fun(object)
    return prevResult
  }
}
