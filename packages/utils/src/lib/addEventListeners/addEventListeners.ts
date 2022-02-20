import { Lambda } from '@pavel/types'

type ListenerOf<Event extends keyof HTMLElementEventMap> = (
  this: HTMLElement,
  event: HTMLElementEventMap[Event],
) => unknown

export function addEventListeners(
  element: HTMLElement,
  listenerByEvent: Partial<{
    [Event in keyof HTMLElementEventMap]: ListenerOf<Event>
  }>,
): Lambda {
  for (const event in listenerByEvent) {
    const listener = listenerByEvent[event as keyof HTMLElementEventMap]

    element.addEventListener(event, listener as never)
  }

  return function removeEventListeners() {
    for (const event in listenerByEvent) {
      const listener = listenerByEvent[event as keyof HTMLElementEventMap]

      element.removeEventListener(event, listener as never)
    }
  }
}
