import { Reducer, AnyAction, Middleware } from 'redux'

const BATCH = 'BATCH'

export function batchReducer<State>(
  reducer: Reducer<State | undefined>,
): Reducer<State | undefined> {
  return function batchingReducer(state, action) {
    if (!isBatchAction(action)) {
      return reducer(state, action)
    }

    return action.actions.reduce(
      (temporalState, action) => reducer(temporalState, action),
      state,
    )
  }
}

export const batchMiddleware: Middleware = () => next => action => {
  if (!Array.isArray(action)) {
    return next(action)
  }

  const batchAction: BatchAction = { type: BATCH, actions: action }

  next(batchAction)
}

type BatchAction = {
  type: typeof BATCH
  actions: AnyAction[]
}

function isBatchAction(action: AnyAction): action is BatchAction {
  return action.type === 'BATCH'
}
