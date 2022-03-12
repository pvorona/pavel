import { isBrowser } from '@pavel/utils'
import { useCallback, useState } from 'react'

export function useStorage<T>({
  key,
  initialValue,
  storage,
}: {
  key: string
  initialValue: T
  storage: Storage
}) {
  const [storedValue, setStoredValue] = useState(() => {
    if (!isBrowser) {
      return initialValue
    }

    try {
      const item = storage.getItem(key)

      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)

      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T) => {
      try {
        // TODO:
        // - fix rerenders
        setStoredValue(value)

        if (isBrowser) {
          storage.setItem(key, JSON.stringify(value))
        }
      } catch (error) {
        console.log(error)
      }
    },
    [key, storage],
  )

  const removeItem = useCallback(() => {
    if (isBrowser) {
      try {
        storage.removeItem(key)
      } catch (error) {
        console.error(error)
      }
    }
  }, [key, storage])

  return [storedValue, setValue, removeItem]
}
