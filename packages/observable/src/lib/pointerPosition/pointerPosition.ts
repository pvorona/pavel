import { isBrowser } from '@pavel/utils'
import { observable } from '../observable'

export const pointerPosition = observable({ x: 0, y: 0 })

if (isBrowser) {
  function onMouseMove(e: MouseEvent) {
    pointerPosition.set({
      x: e.clientX,
      y: e.clientY,
    })
  }

  window.addEventListener('mousemove', onMouseMove)
}
