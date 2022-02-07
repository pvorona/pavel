import { removeFirstElementOccurrence } from '../utils'
import { Observer, EagerObservable, Settable, Gettable } from '../types'

export function observable<T>(
  initialValue: T,
): EagerObservable<T> & Settable<T> & Gettable<T> {
  let value = initialValue
  const observers: Observer<T>[] = []

  function notify() {
    for (const observer of observers) {
      observer(value)
    }
  }

  return {
    set(newValueOrFactory) {
      const newValue =
        newValueOrFactory instanceof Function
          ? newValueOrFactory(value)
          : newValueOrFactory

      if (newValue === value) {
        return
      }

      value = newValue

      notify()
    },
    get() {
      return value
    },
    // fire immediately can solve Gettable dependency
    observe(observer) {
      observers.push(observer)

      return () => {
        removeFirstElementOccurrence(observers, observer)
      }
    },
  }
}

// export function pureObservable <A> (
//   // initialValue: A,
// ): Observable<A> & Settable<A> {
//   const observers: Observer<A>[] = []

//   return {
//     set (value) {
//       observers.forEach(observer => observer(value))
//     },
//     // fire immegiately can solve Gettable dependency
//     observe (observer: Observer<A>) {
//       observers.push(observer)

//       return () => {
//         for (let i = 0; i < observers.length; i++) {
//           if (observers[i] === observer) {
//             observers.splice(i, 1)
//             return
//           }
//         }
//       }
//     },
//   }
// }

// function gettable <A> (observable: Observable<A>): Gettable<A> {
//   let value: A

//   observable.observe(newValue => value = newValue)

//   function get () {
//     return value
//   }

//   return { get }
// }
