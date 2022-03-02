import { animateOnce, selectElementContent } from '@pavel/utils'
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
  onInput?: (value: string) => void
  children: string
}) {
  const [element, setElement] = useState<HTMLDivElement | undefined>()

  useEffect(() => {
    if (!element) {
      return
    }

    element.textContent = children
  }, [element, children])

  function onKeyDown(e: React.KeyboardEvent) {
    if (!element) {
      return
    }

    if (e.code === ENTER) {
      element.blur()
      animateOnce(element, 'animate-success')
    }

    if (e.code === ESCAPE) {
      element.blur()
      animateOnce(element, 'animate-success')
    }
  }

  function ownOnInput(e: FormEvent<HTMLDivElement>) {
    onInput(e.currentTarget.innerText)
  }

  function onFocus(e: React.FocusEvent<HTMLSpanElement>) {
    selectElementContent(e.target)
  }

  function onBlur(e: React.FocusEvent<HTMLDivElement>) {
    // animateOnce(element, 'animate-success')
  }

  return (
    <div
      {...props}
      onInput={ownOnInput}
      ref={setElement}
      className={classNames(className, styles.TextField, 'rounded-sm')}
      contentEditable
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      spellCheck="false"
      autoCorrect="off"
      autoCapitalize="off"
      suppressContentEditableWarning={true}
    />
  )
}
