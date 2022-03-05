import { Option } from './types'

export function buildOption(values?: Partial<Option>): Omit<Option, 'id'> {
  return {
    name: 'Option',
    features: {},
    type: '',
    ...values,
  }
}
