import { getDateOfMonth } from '@pavel/utils'
import { Decision, DecisionMachine } from '../types'

export function createMonthlyOscillationDecisionMachine({
  buyUSDDate,
  buyBYNDate,
}: {
  readonly buyUSDDate: number
  readonly buyBYNDate: number
}): DecisionMachine {
  return {
    next: ({ timestamp, capital }) => {
      const date = getDateOfMonth(timestamp)

      if (date === buyBYNDate && capital.USD > 0) {
        return Decision.BUY_BYN
      }

      if (date === buyUSDDate && capital.BYN > 0) {
        return Decision.BUY_USD
      }

      return Decision.DO_NOTHING
    },
  }
}
