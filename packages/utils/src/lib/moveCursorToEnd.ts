import { isNumber } from '@pavel/assert'

export function moveCursorToEnd(el: HTMLInputElement) {
  if (isNumber(el.selectionStart)) {
    el.selectionStart = el.selectionEnd = el.value.length
  }
}
