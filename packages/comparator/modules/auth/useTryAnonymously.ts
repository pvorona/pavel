import { Lambda, LoadingStatus } from '@pavel/types'
import { useState, useCallback } from 'react'
import { signInAnonymously } from '@pavel/comparator-shared'

type TryAnonymouslyParams = {
  onSuccess?: Lambda
}

export function useTryAnonymously({ onSuccess }: TryAnonymouslyParams = {}) {
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE)

  const tryAnonymously = useCallback(async () => {
    setStatus(LoadingStatus.IN_PROGRESS)
    try {
      await signInAnonymously()
      setStatus(LoadingStatus.COMPLETED)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to sign in anonymously', error)
      setStatus(LoadingStatus.FAILED)
    }
  }, [onSuccess])

  return {
    tryAnonymously,
    status,
  }
}
