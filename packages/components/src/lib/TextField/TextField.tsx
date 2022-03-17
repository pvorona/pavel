import { selectElementContent } from '@pavel/utils'
import classNames from 'classnames'
import React, { FormEvent, useEffect, useState } from 'react'
import styles from './TextField.module.css'

const ENTER = 'Enter'
const ESCAPE = 'Escape'

export function TextField({
  className,
  onInput,
  children,
  ...props
}: {
  className?: string
  placeholder?: string
  onInput: (value: string) => void
  children: string
}) {
  const [element, setElement] = useState<HTMLTextAreaElement | null>(null)

  // useEffect(() => {
  //   if (!element) {
  //     return
  //   }

  //   element.textContent = children
  // }, [element, children])

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

  useEffect(() => {
    if (element) {
      element.style.height = 'auto'
      element.style.height = `${element.scrollHeight}px`
    }
  }, [children, element])

  function ownOnInput(e: FormEvent<HTMLTextAreaElement>) {
    onInput(e.currentTarget.value)
  }

  function onFocus(e: React.FocusEvent<HTMLSpanElement>) {
    selectElementContent(e.target)
  }

  // function onBlur(e: React.FocusEvent<HTMLDivElement>) {
  // animateOnce(element, 'animate-success')
  // }

  return (
    <textarea
      {...props}
      onInput={ownOnInput}
      ref={setElement}
      className={classNames(
        className,
        styles['TextField'],
        'outline-none cursor-text transition-shadow rounded-sm dark:hover:shadow-1 dark:focus:shadow-2 hover:shadow-2 focus:shadow-1 w-full h-full resize-none',
      )}
      // contentEditable
      // onKeyDown={onKeyDown}
      // onBlur={onBlur}
      // onFocus={onFocus}
      spellCheck="false"
      autoCorrect="off"
      autoCapitalize="off"
      // suppressContentEditableWarning={true}
      value={children}
    />
  )
}
