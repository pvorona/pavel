import { animateOnce } from '@pavel/utils'
import classNames from 'classnames'
import { useState } from 'react'
import styles from './TextField.module.css'

const ENTER = 'Enter'
const ESCAPE = 'Escape'

export function TextField({
  className,
  children,
  ...props
}: {
  className?: string
  placeholder?: string
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void
  children: string
}) {
  const [span, setSpan] = useState<HTMLSpanElement | undefined>()

  function onKeyDown(e: React.KeyboardEvent) {
    if (!span) {
      return
    }

    if (e.code === ENTER) {
      span.blur()
      animateOnce(span, 'animate-success')
    }

    if (e.code === ESCAPE) {
      span.blur()
    }
  }

  // function onFocus(e: React.FocusEvent<HTMLSpanElement>) {
  // selectElementContent(e.target)
  // }

  return (
    <input
      {...props}
      value={children}
      type="text"
      ref={setSpan}
      className={classNames(
        className,
        'rounded-sm bg-transparent',
        styles.TextField,
      )}
      // contentEditable
      onKeyDown={onKeyDown}
      // onFocus={onFocus}
      spellCheck="false"
      autoCorrect="off"
      autoCapitalize="off"
      suppressContentEditableWarning={true}
    />
  )
}
