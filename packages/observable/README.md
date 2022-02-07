Abstractions for managing state and UI updates.

### Basic usage:

```ts
import { observable, effect } from '@pvorona/observable'

const App = () => {
  const time = observable(Date.now())

  setInterval(() => {
    time.set(Date.now())
  }, 1000)

  // `effect`s are performed at most once per frame
  effect([time], time => {
    document.body.innerText = `${time}`
  })
}

App()
```

### More complex example:

```ts
import { observable, computeLazy, effect } from '@pvorona/observable'

const App = () => {
  const a = observable(1)
  const b = observable(2)

  // `computeLazy` is also recomputed at most once per frame
  // but it returns `observable` that can be used later.
  // Useful for heavy computations
  const message = computeLazy([a, b], (a, b) => `a value: ${a}, b value: ${b}`)

  effect([message], message => {
    document.body.innerText = message
  })

  a.set(98)
  b.set(99)

  a.set(100)
  b.set(101)

  // Only 2 messages will be displayed:
  // "a value: 1, b value: 2" - initial values
  // "a value: 100, b value: 101" - last values
  // All the changes to a and b occurred in a single frame
  // only the last values will be observed by `effect`
}

App()
```

### API:

```ts
import {
  // wrapped value:
  // const a = observable(1)
  // a.get() === 1
  // a.set(2)
  // a.get() === 2
  // a.observe((value) => ...)
  observable,

  // subscribe to many observables
  // observe([a, b, c], (aValue, bValue, cValue) => ...)
  observe,

  // combine multiple observables into one
  // const a = observable(1)
  // const b = observable(2)
  // const c = observable(3)
  // const computed = compute([a, b, c], (a, b, c) => a + b + c)
  // computed.get() === 1 + 2 + 3
  // result is cached and won't be recomputed until
  // any of the dependencies change
  compute,

  // Same as `compute` but performed once per frame at most
  computeLazy,

  // Same as `observe` but performed once per frame at most
  effect,

  // Instead of changing the value from 1 to 100 instantly
  // it'll curve out smoothly changing the value each frame.
  // Observed values can be: [1, 1,3, 2.6, ..., 100]
  animationObservable,
} from '@pvorona/observable'
```
