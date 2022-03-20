import { Lambda } from '@pavel/types'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  MouseEvent,
} from 'react'
import { useState, KeyboardEvent } from 'react'
import { ButtonBase, ButtonBaseProps } from '../ButtonBase'

export const DEFAULT_DELAY = 2_000

export enum HoldState {
  DEFAULT = 'DEFAULT',
  PRESSED = 'PRESSED',
}

export type HoldConfirmationButtonProps = PropsWithChildren<
  Omit<
    ButtonBaseProps,
    'ref' | 'onMouseDown' | 'onMouseUp' | 'onKeyDown' | 'onKeyUp'
  > & {
    onConfirmationCompleted?: Lambda
    onConfirmationStart?: Lambda
    onConfirmationCancel?: Lambda
    delay?: number
  }
>

const START_KEYS = ['Enter', ' ', 'Delete', 'Backspace', 'Clear']
const STOP_KEYS = [...START_KEYS, 'Escape']

// Todo
// - Handle touch leave
export function HoldConfirmationButton({
  onMouseLeave: onMouseLeaveProp,
  onConfirmationStart,
  onConfirmationCancel,
  onConfirmationCompleted,
  delay = DEFAULT_DELAY,
  ...props
}: HoldConfirmationButtonProps) {
  const [element, setElement] = useState<HTMLButtonElement | null>(null)
  const [pressedState, setPressedState] = useState(HoldState.DEFAULT)
  const [isCompleted, setIsCompleted] = useState(false)
  const timeoutRef = useRef<number | undefined>()

  const onComplete = useCallback(() => {
    setIsCompleted(true)
    onConfirmationCompleted?.()
  }, [onConfirmationCompleted])

  const startHold = useCallback(() => {
    if (pressedState === HoldState.PRESSED) {
      return
    }

    setPressedState(HoldState.PRESSED)

    if (isCompleted) {
      return
    }

    onConfirmationStart?.()
    timeoutRef.current = window.setTimeout(onComplete, delay)
    // Invalid handle if delay value changes during the confirmation
  }, [pressedState, onComplete, isCompleted, delay, onConfirmationStart])

  const stopHold = useCallback(() => {
    setPressedState(HoldState.DEFAULT)

    if (!isCompleted) {
      window.clearTimeout(timeoutRef.current)
      onConfirmationCancel?.()
    }
  }, [isCompleted, onConfirmationCancel])

  useEffect(() => {
    if (!element) {
      return
    }

    // eslint-disable-next-line no-inner-declarations
    function onTouchStart(event: TouchEvent) {
      event.preventDefault()
      startHold()
    }

    // eslint-disable-next-line no-inner-declarations
    function onTouchEnd() {
      stopHold()
    }

    element.addEventListener('touchstart', onTouchStart, { passive: false })
    element.addEventListener('touchend', onTouchEnd, { passive: false })
    element.addEventListener('touchcancel', onTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchend', onTouchEnd)
      element.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [element, startHold, stopHold])

  function onMouseDown() {
    startHold()
  }

  function onMouseUp() {
    stopHold()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (START_KEYS.includes(event.key)) {
      startHold()
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    if (STOP_KEYS.includes(event.key)) {
      stopHold()
    }
  }

  function onMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    stopHold()

    onMouseLeaveProp?.(event)
  }

  return (
    <ButtonBase
      {...props}
      ref={setElement}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseLeave={onMouseLeave}
    />
  )
}
