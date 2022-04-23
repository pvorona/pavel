export class BiMap<K, V> {
  private keyValueMap: Map<K, V>
  private valueKeyMap: Map<V, K>

  constructor(source?: Iterable<[K, V]>) {
    this.keyValueMap = new Map<K, V>()
    this.valueKeyMap = new Map<V, K>()

    if (source) {
      for (const [key, value] of source) {
        this.setKeyValue(key, value)
      }
    }
  }

  getByKey(key: K) {
    return this.keyValueMap.get(key)
  }

  getByValue(value: V) {
    return this.valueKeyMap.get(value)
  }

  hasKey(key: K) {
    return this.keyValueMap.has(key)
  }

  hasValue(value: V) {
    return this.valueKeyMap.has(value)
  }

  setKeyValue(key: K, value: V) {
    this.keyValueMap.set(key, value)
    this.valueKeyMap.set(value, key)
  }

  setValueKey(value: V, key: K) {
    this.keyValueMap.set(key, value)
    this.valueKeyMap.set(value, key)
  }

  deleteByKey(key: K) {
    const value = this.keyValueMap.get(key)

    if (value === undefined) {
      return
    }

    this.keyValueMap.delete(key)
    this.valueKeyMap.delete(value)
  }

  deleteByValue(value: V) {
    const key = this.valueKeyMap.get(value)

    if (key === undefined) {
      return
    }

    this.keyValueMap.delete(key)
    this.valueKeyMap.delete(value)
  }

  entries() {
    const entries = []

    for (const key in this.keyValueMap) {
      const value = this.keyValueMap[key as keyof typeof this.keyValueMap]
      const entry = [key, value]

      entries.push(entry)
    }

    return entries
  }
}
