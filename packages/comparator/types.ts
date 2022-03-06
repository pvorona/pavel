import {
  AuthState,
  OptionsState,
  ComparisonsState,
  ComparisonTableState,
} from './modules'

export type RootState = {
  auth: AuthState
  options: OptionsState
  comparisons: ComparisonsState
  comparisonTable: ComparisonTableState
}
