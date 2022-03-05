import { Comparison } from '@pavel/comparator-shared'

export type ComparisonsState = {
  byId: Record<string, Comparison>
  currentComparisonId: string
}
