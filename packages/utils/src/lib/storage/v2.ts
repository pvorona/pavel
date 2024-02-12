import { isFunction, isNull, isString } from '@pavel/assert'

type GetItemResult<T extends string | null> =
  | { value: T; isSuccess: true }
  | { value: T; isSuccess: false; error: unknown }

type ValueOrGetter<T> = T | (() => T)

function getValue<T>(valueOrGetter: ValueOrGetter<T>): T {
  if (isFunction(valueOrGetter)) {
    return valueOrGetter()
  }

  return valueOrGetter
}

export function getItem(
  key: string,
  defaultValue: ValueOrGetter<string>,
  storage?: Storage,
): GetItemResult<string>
export function getItem(
  key: string,
  defaultValue?: ValueOrGetter<string | null>,
  storage?: Storage,
): GetItemResult<string | null>
export function getItem(
  key: string,
  defaultValue: ValueOrGetter<string | null> = null,
  storage = localStorage,
): GetItemResult<string | null> {
  try {
    const valueFromStorage = storage.getItem(key)

    if (isNull(valueFromStorage)) {
      return {
        isSuccess: true,
        value: getValue(defaultValue),
      }
    }

    return {
      isSuccess: true,
      value: valueFromStorage,
    }
  } catch (error) {
    return {
      isSuccess: false,
      value: getValue(defaultValue),
      error,
    }
  }
}

type SetItemResult = { isSuccess: true } | { isSuccess: false; error: unknown }

export function setItem(
  key: string,
  value: string,
  storage: Storage = localStorage,
): SetItemResult {
  try {
    storage.setItem(key, value)

    return { isSuccess: true }
  } catch (error) {
    return { isSuccess: false, error }
  }
}

type RemoveItemResult =
  | { isSuccess: true }
  | { isSuccess: false; error: unknown }

export function removeItem(
  key: string,
  storage: Storage = localStorage,
): RemoveItemResult {
  try {
    storage.removeItem(key)

    return { isSuccess: true }
  } catch (error) {
    return { isSuccess: false, error }
  }
}

type ValueTypeOf<T extends ValueOrGetter<unknown>> = T extends ValueOrGetter<
  infer V
>
  ? V
  : never

type BoundGetItem = {
  (defaultValue?: ValueOrGetter<string>): GetItemResult<string>
  (defaultValue?: ValueOrGetter<string | null>): GetItemResult<string | null>
  (): GetItemResult<string | null>
}

type BoundStorage = {
  get: BoundGetItem
  set: (value: string) => SetItemResult
  remove: () => RemoveItemResult
}

export function bindStorage(key: string, storage?: Storage): BoundStorage
export function bindStorage(config: {
  key: string
  storage?: Storage
}): BoundStorage
export function bindStorage(
  keyOrConfig:
    | string
    | {
        key: string
        storage?: Storage
      },
  maybeStorage?: Storage,
): BoundStorage {
  const key = isString(keyOrConfig) ? keyOrConfig : keyOrConfig.key
  const storage =
    (isString(keyOrConfig) ? maybeStorage : keyOrConfig.storage) ?? localStorage

  return {
    get: defaultValue => getItem(key, defaultValue, storage),
    set: value => setItem(key, value, storage),
    remove: () => removeItem(key, storage),
  }
}
