import { animateOnce, selectElementContent } from '@pavel/utils'
import classNames from 'classnames'
import { FormEvent, useState } from 'react'
import styles from './TextField.module.css'

const ENTER = 'Enter'
const ESCAPE = 'Escape'

export function TextField({
  className,
  onInput,
  ...props
}: {
  className?: string
  placeholder?: string
  onInput?: (value: string) => void
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

  function ownOnInput(e: FormEvent<HTMLDivElement>) {
    onInput(e.currentTarget.textContent)
  }

  function onFocus(e: React.FocusEvent<HTMLSpanElement>) {
    selectElementContent(e.target)
  }

  return (
    <div
      {...props}
      onInput={ownOnInput}
      ref={setSpan}
      className={classNames(className, styles.TextField, 'rounded-sm')}
      contentEditable
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      spellCheck="false"
      autoCorrect="off"
      autoCapitalize="off"
      suppressContentEditableWarning={true}
    />
  )
}
