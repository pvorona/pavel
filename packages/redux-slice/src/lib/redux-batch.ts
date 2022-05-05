import { assert, isObject } from '@pavel/assert'
import { Reducer, AnyAction, Middleware } from 'redux'

const BATCH = 'BATCH'

export function batch(actions: AnyAction[]) {
  return {
    type: BATCH,
    payload: actions,
  }
}

export function batchReducer<State>(
  reducer: Reducer<State | undefined>,
): Reducer<State | undefined> {
  return function batchingReducer(state, action) {
    if (!isBatchAction(action)) {
      return reducer(state, action)
    }

    return action.payload.reduce((temporalState, action) => {
      assert(
        isObject(action),
        `Only plain actions can be batched. Received: ${action}`,
      )

      return reducer(temporalState, action)
    }, state)
  }
}

export const batchMiddleware: Middleware = () => next => action => {
  // if (!isBatchAction(action)) {
  //   return next(action)
  // }

  // const batchAction: BatchAction = { type: BATCH, payload: action.payload }

  next(action)
}

type BatchAction = {
  type: typeof BATCH
  payload: AnyAction[]
}

function isBatchAction(action: AnyAction): action is BatchAction {
  return action.type === BATCH
}
