import { uuid } from '@pavel/utils'
import { Feature } from './types'
import { Option } from '../options'
import { Comparison } from '.'

export function createFeature(): Feature {
  return {
    id: uuid(),
    name: '',
    type: 'text',
    description: '',
    isDescriptionExpanded: false,
    isExpanded: true,
    // new: true,
    // TODO
    // Highlight new features
    // Focus input and select text when new feature is added
  }
}

export function createOption(values?: Partial<Option>): Option {
  return {
    id: uuid(),
    name: 'Option',
    features: {},
    ...values,
  }
}

export function createComparison(values?: Partial<Comparison>): Comparison {
  return {
    id: uuid(),
    name: '',
    features: [],
    optionIds: [],
    isLocked: false,
    isNew: false,
    ...values,
  }
}
