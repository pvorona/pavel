import { Option } from './types'

export function buildOption(values?: Partial<Option>): Partial<Option> {
  return {
    name: 'Option',
    features: {},
    type: '',
    ...values,
  }
}
