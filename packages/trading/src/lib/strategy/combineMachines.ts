import { Decision, DecisionMachine } from '../types'

export function combineMachines(
  machines: readonly DecisionMachine[],
): DecisionMachine {
  return {
    next: state => {
      for (const machine of machines) {
        const decision = machine.next(state)

        if (decision !== Decision.DO_NOTHING) {
          return decision
        }
      }

      return Decision.DO_NOTHING
    },
  }
}
