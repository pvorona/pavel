## Task scheduling

```ts
import { scheduleTask, PRIORITY } from 'scheduling'

let windowWidth: number | undefined

scheduleTask(() => {
  document.body.innerText = `Window width is ${windowWidth}px`
}, PRIORITIES.WRITE)

scheduleTask(() => {
  windowWidth = window.innerWidth
}, PRIORITIES.READ)

// Window width is 900px
```

Tasks are scheduled to be executed before the next animation frame. Execution order is based on the priority: `READ`, `COMPUTE`, `WRITE`.
