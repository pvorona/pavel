import { Option } from './option.types'

export function buildOption(
  values: Partial<Option> & { ownerId: string },
): Omit<Option, 'id'> {
  return {
    name: 'Option',
    features: {},
    ...values,
  }
}
