import { isBrowser } from '@pavel/utils'
import { useCallback, useState } from 'react'

// Extract to react-specific package
export function useStorage<T>({
  key,
  initialValue,
  storage,
}: {
  key: string
  initialValue: T
  storage: Storage
}) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (!isBrowser) {
      return initialValue
    }

    try {
      // Get from local storage by key
      const item = storage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T) => {
      try {
        // Allow value to be a function so we have same API as useState
        // Save state
        // TODO:
        // - fix rerenders
        setStoredValue(value)
        if (isBrowser) {
          storage.setItem(key, JSON.stringify(value))
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
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
