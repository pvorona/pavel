import { isBrowser, noop } from '@pavel/utils'
import { useCallback, useState } from 'react'

// TODO:
// - simplify this hook and extract storage operations
export function useDefaultFromStorage<T>({
  key,
  initialValue,
  storage,
}: {
  key: string
  initialValue: T
  storage: Storage
}) {
  if (isBrowser) {
    return [initialValue, noop, noop]
  }

  const [storedOrInitialValue] = useState(() => {
    try {
      const item = storage.getItem(key)

      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)

      return initialValue
    }
  })

  const store = useCallback(
    (value: T) => {
      try {
        storage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.log(error)
      }
    },
    [key, storage],
  )

  const remove = useCallback(() => {
    try {
      storage.removeItem(key)
    } catch (error) {
      console.error(error)
    }
  }, [key, storage])

  return [storedOrInitialValue, store, remove]
}
