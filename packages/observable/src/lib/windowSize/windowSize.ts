import { isBrowser } from '@pavel/utils'
import { observable } from '../observable'

export const windowHeight = observable(isBrowser ? window.innerHeight : 0)

export const windowWidth = observable(isBrowser ? window.innerWidth : 0)

if (isBrowser) {
  windowHeight.set(window.innerHeight)

  window.addEventListener('resize', () => {
    windowHeight.set(window.innerHeight)
    windowWidth.set(window.innerWidth)
  })
}
