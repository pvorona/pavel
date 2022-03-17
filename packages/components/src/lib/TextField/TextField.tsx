import classNames from 'classnames'
import React, { FormEvent, useEffect, useState } from 'react'
import styles from './TextField.module.css'

const ENTER = 'Enter'
const ESCAPE = 'Escape'

export function TextField({
  className,
  onInput: onInputProp,
  children,
  ...props
}: {
  className?: string
  placeholder?: string
  onInput: (value: string) => void
  children: string
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (element) {
      element.innerText = children
    }
    // children are not included by intent -- we need to run this only for initial children
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element])

  function onKeyDown(e: React.KeyboardEvent) {
    if (!element) {
      return
    }

    // if (e.code === ENTER) {
    // element.blur()
    // animateOnce(element, 'animate-success')
    // }

    if (e.code === ESCAPE) {
      element.blur()
      // animateOnce(element, 'animate-success')
    }
  }

  function onInput(e: FormEvent<HTMLDivElement>) {
    onInputProp(e.currentTarget.innerText)
  }

  function onFocus(e: React.FocusEvent<HTMLSpanElement>) {
    // selectElementContent(e.target)
  }

  // function onBlur(e: React.FocusEvent<HTMLDivElement>) {
  // animateOnce(element, 'animate-success')
  // }

  return (
    <div
      {...props}
      onInput={onInput}
      ref={setElement}
      className={classNames(
        className,
        styles['TextField'],
        'outline-none cursor-text transition-shadow rounded-sm dark:hover:shadow-1 dark:focus:shadow-2 hover:shadow-2 focus:shadow-1',
      )}
      contentEditable
      onKeyDown={onKeyDown}
      // onBlur={onBlur}
      onFocus={onFocus}
      spellCheck="false"
      autoCorrect="off"
      autoCapitalize="off"
      suppressContentEditableWarning={true}
    />
  )
}
