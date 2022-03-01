import { isBrowser } from '@pavel/utils'
import { observable } from '../observable'

export const windowHeight = observable(isBrowser ? window.innerHeight : 0)

if (isBrowser) {
  windowHeight.value = window.innerHeight

  window.addEventListener('resize', () => [
    (windowHeight.value = window.innerHeight),
  ])
}
