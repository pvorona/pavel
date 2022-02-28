import { isBrowser } from '@pavel/utils'
import { observable } from '../observable'

export const pointerPosition = observable({ x: 0, y: 0 })

function onMouseMove(e: MouseEvent) {
  pointerPosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
}

if (isBrowser) {
  window.addEventListener('mousemove', onMouseMove)
}
