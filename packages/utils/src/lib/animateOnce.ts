import { forceReflow } from './forceReflow'

export function animateOnce(
  element: HTMLElement,
  className: string,
): Promise<void> {
  if (element.classList.contains(className)) {
    element.classList.remove(className)
    forceReflow(element)
  }

  element.classList.add(className)

  return new Promise(resolve => {
    element.addEventListener(
      'animationend',
      () => {
        element.classList.remove(className)
        resolve()
      },
      { once: true },
    )
  })
}
