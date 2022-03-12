export const getFromStorage = <T>(
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

export const saveToStorage = <T>(
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

export const removeFromStorage = (key: string, storage = localStorage) => {
  try {
    storage.removeItem(key)
  } catch (error) {
    console.error(
      `Failed to remove ${key} in storage: ${JSON.stringify(error)}`,
    )
  }
}
