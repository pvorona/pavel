import { getFromStorage, isServer } from '@pavel/utils'

export function useDefaultFromStorage<T>({
  key,
  defaultValue: initialValue,
  storage,
}: {
  key: string
  defaultValue: T
  storage: Storage
}) {
  if (isServer) {
    return initialValue
  }

  return getFromStorage(key, initialValue, storage)
}
