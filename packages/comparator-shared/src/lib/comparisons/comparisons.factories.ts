import { uuid } from '@pavel/utils'
import { Comparison, Feature } from './types'

export function buildFeature(): Feature {
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

function formatDate(timestamp: number) {
  const date = new Date(timestamp)

  return `${String(date.getDate()).padStart(2)}.${String(
    date.getMonth() + 1,
  ).padStart(2)}.${date.getFullYear()}`
}

export function buildComparison(
  values?: Partial<Comparison>,
): Partial<Comparison> {
  return {
    // id: uuid(),
    name: `Comparison created at ${formatDate(Date.now())}`,
    features: [],
    optionIds: [],
    isLocked: false,
    ...values,
  }
}
