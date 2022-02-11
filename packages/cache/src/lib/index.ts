export function getOrCreate<Key extends string | number, Value>(
  source: { [key in Key]: Value },
  key: Key,
  createOrDefaultValue: ((key: Key) => Value) | Value,
) {
  if (!(key in source)) {
    source[key] = createValue(createOrDefaultValue, key)
  }
  return source[key]
}

function createValue<Key extends string | number, Value>(
  createOrDefaultValue: ((key: Key) => Value) | Value,
  key: Key,
): Value {
  if (createOrDefaultValue instanceof Function) {
    return createOrDefaultValue(key)
  }

  return createOrDefaultValue
}

export type Cache<Key extends string | number, Value> = {
  get: (key: Key) => Value
}

export function createCache<Key extends string | number, Value>(
  create: (key: Key) => Value,
): Cache<Key, Value> {
  const cache = {} as Record<Key, Value>

  return {
    get: (key: Key) => getOrCreate(cache, key, create),
  }
}
