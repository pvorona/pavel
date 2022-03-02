import { ComparisonsState } from '../modules/comparisons'
import { OptionsState } from '../modules/options'

export type RootState = {
  options: OptionsState
  comparisons: ComparisonsState
}
