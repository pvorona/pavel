export function selectElementContent(el: HTMLElement) {
  const selection = window.getSelection()

  if (!selection) {
    return
  }

  const range = document.createRange()

  range.selectNodeContents(el)
  selection.removeAllRanges()
  selection.addRange(range)
}
