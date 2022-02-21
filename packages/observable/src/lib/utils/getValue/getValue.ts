import { ValueOrUpdater } from '../../types'

export function getValue<T>(
  valueOrUpdater: ValueOrUpdater<T>,
  currentValue: T,
): T {
  return valueOrUpdater instanceof Function
    ? valueOrUpdater(currentValue)
    : valueOrUpdater
}
