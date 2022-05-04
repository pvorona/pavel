import { Button, ShareIcon } from '@pavel/components'
import { useRef, useState } from 'react'
import { Snackbar } from '../Snackbar'
import { Surface } from '../Surface'

const CONFIRMATION_VISIBLE_INTERVAL_MS = 3_000

export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutIdRef = useRef<number | undefined>()

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)

    setIsOpen(true)

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    timeoutIdRef.current = window.setTimeout(
      () => setIsOpen(false),
      CONFIRMATION_VISIBLE_INTERVAL_MS,
    )
  }

  return (
    <>
      <Surface className="fixed top-8 right-12" rounded>
        <Button
          rounded
          onClick={handleShare}
          style={{
            '--border-width': '0',
          }}
        >
          <ShareIcon className="-ml-3 mr-3" /> Share
        </Button>
      </Surface>
      <Snackbar isOpen={isOpen}>URL copied to clipboard</Snackbar>
    </>
  )
}
