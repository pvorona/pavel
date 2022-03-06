import { OptionsState, ComparisonsState, ComparisonTableState } from './modules'

export type RootState = {
  options: OptionsState
  comparisons: ComparisonsState
  comparisonTable: ComparisonTableState
}
