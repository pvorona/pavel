import { createFunctions } from "@pavel/functions"
import { Lambda } from "@pavel/types"
import { EagerSubject, observable, Observer, collectValues, getValue, observe } from ".."

export function observableArray<T>(initialValue: T[]): EagerSubject<T[]> {
  const observables = observable<EagerSubject<T>[]>(
    initialValue.map(value => observable(value)),
  )
  const observers = createFunctions<Observer<T[]>>()
  let unobserveValues: undefined | Lambda

  function notify() {
    observers.invoke(collectValues(observables.get()))
  }

  return {
    name: 'observableArray',
    get() {
      return collectValues(observables.get())
    },
    set(newValueOrFactory): void {
      if (unobserveValues) {
        unobserveValues()
      }

      const newValue = getValue(
        newValueOrFactory,
        collectValues(observables.get()),
      )
      observables.set(newValue.map(value => observable(value)))

      unobserveValues = observe(observables.get(), notify)
    },
    observe: observers.add,
  }
}
