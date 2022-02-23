import { RecordKey } from '@pavel/types'

const proxyToRawMap = new WeakMap()
const rawToProxyMap = new WeakMap()

export type Target = Record<RecordKey, unknown>

export function isProxy(value: Target) {
  return proxyToRawMap.has(value)
}

export function hasCorrespondingProxy(value: Target) {
  return rawToProxyMap.has(value)
}

export function getProxyFor(value: Target) {
  return rawToProxyMap.get(value)
}

export function getRawForProxy(proxy: Target) {
  return proxyToRawMap.get(proxy)
}

export function setProxyForRaw(raw: Target, proxy: Target) {
  rawToProxyMap.set(raw, proxy)
}

export function setRawForProxy(proxy: Target, raw: Target) {
  proxyToRawMap.set(proxy, raw)
}
