import { isBrowser } from '../isBrowser'
import { noop } from '../noop'

export const getFromStorageBrowser = <T>(
  key: string,
  defaultValue: T,
  storage = localStorage,
) => {
  try {
    const item = storage.getItem(key)

    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(
      `Failed to retrieve ${key} from storage: ${JSON.stringify(error)}`,
    )

    return defaultValue
  }
}

export const getFromStorage = isBrowser ? getFromStorageBrowser : noop

export const saveToStorageBrowser = <T>(
  key: string,
  value: T,
  storage = localStorage,
) => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to set ${key} in storage: ${JSON.stringify(error)}`)
  }
}

export const saveToStorage = isBrowser ? saveToStorageBrowser : noop

export const removeFromStorageBrowser = (
  key: string,
  storage = localStorage,
) => {
  try {
    storage.removeItem(key)
  } catch (error) {
    console.error(
      `Failed to remove ${key} in storage: ${JSON.stringify(error)}`,
    )
  }
}

export const removeFromStorage = isBrowser ? removeFromStorageBrowser : noop
