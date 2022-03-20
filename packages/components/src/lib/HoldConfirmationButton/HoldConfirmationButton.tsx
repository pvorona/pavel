import { PropsWithChildren, useEffect } from 'react'
import { useState, KeyboardEvent } from 'react'
import { ButtonBase, ButtonBaseProps } from '../ButtonBase'

export enum HoldState {
  DEFAULT = 'DEFAULT',
  PRESSED = 'PRESSED',
}

export type HoldConfirmationButtonProps = PropsWithChildren<
  Omit<
    ButtonBaseProps,
    | 'ref'
    | 'onMouseDown'
    | 'onMouseUp'
    | 'onKeyDown'
    | 'onKeyUp'
    | 'onMouseLeave'
  >
>

const START_KEYS = ['Enter', ' ', 'Delete', 'Backspace', 'Clear']
const STOP_KEYS = [...START_KEYS, 'Escape']

// Todo
// - Handle touch leave
export function HoldConfirmationButton(props: HoldConfirmationButtonProps) {
  const [element, setElement] = useState<HTMLButtonElement | null>(null)
  const [pressedState, setPressedState] = useState(HoldState.DEFAULT)

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
  }, [element])

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

  const startHold = () => setPressedState(HoldState.PRESSED)
  const stopHold = () => setPressedState(HoldState.DEFAULT)

  return (
    <ButtonBase
      {...props}
      ref={setElement}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseLeave={stopHold}
    >
      {pressedState}
    </ButtonBase>
  )
}
