/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecordKey } from '@pavel/types'
import { AnyAction } from 'redux'

type ActionWithPayload<Type extends RecordKey, Payload> = {
  type: Type
  payload: Payload
}

type ActionWithoutPayload<Type extends RecordKey> = {
  type: Type
}

type ActionCreatorWithPayload<Type extends RecordKey, Payload> = (
  payload: Payload,
) => ActionWithPayload<Type, Payload>

type ActionCreatorWithoutPayload<Type extends RecordKey> =
  () => ActionWithoutPayload<Type>

type ActionHandlerWithPayload<State, Payload> = (
  state: State,
  payload: Payload,
) => State

type ActionHandlerWithoutPayload<State> = (state: State) => State

type ActionHandlers<State> = {
  [actionType: RecordKey]:
    | ActionHandlerWithPayload<State, any>
    | ActionHandlerWithoutPayload<State>
}

export function createSlice<
  State = any,
  Handlers extends ActionHandlers<State> = ActionHandlers<State>,
  Name extends string = string,
>({
  initialState,
  name,
  handlers = {} as Handlers,
}: {
  initialState: State
  name: Name
  handlers?: Handlers
}) {
  function reducer(state = initialState, action: AnyAction) {
    const handler = handlers[action.type]

    return typeof handler === 'function'
      ? handler(state, action.payload)
      : state
  }

  const actions = extractActions(name, handlers)

  return {
    reducer,
    actions,
  }
}

// "without payload" case should be before "with payload"
// for correct inference
type ActionCreatorForHandler<
  ActionType extends RecordKey,
  Handler,
> = Handler extends ActionHandlerWithoutPayload<any>
  ? ActionCreatorWithoutPayload<ActionType>
  : Handler extends ActionHandlerWithPayload<any, infer Payload>
  ? ActionCreatorWithPayload<ActionType, Payload>
  : never

type ActionCreatorsForHandlers<Handlers extends ActionHandlers<any>> = {
  [ActionType in keyof Handlers]: ActionCreatorForHandler<
    ActionType,
    Handlers[ActionType]
  >
}

function extractActions<Handlers extends ActionHandlers<any>>(
  sliceName: string,
  handlers: Handlers,
): ActionCreatorsForHandlers<Handlers> {
  const actionCreators = {} as ActionCreatorsForHandlers<Handlers>

  for (const actionType in handlers) {
    const actionCreator = ((payload: any) => {
      return {
        type: actionType,
        payload,
      }
    }) as ActionCreatorForHandler<
      typeof actionType,
      typeof handlers[typeof actionType]
    >

    actionCreator.toString = () => `${sliceName}/${actionType}`

    actionCreators[actionType] = actionCreator
  }

  return actionCreators
}

// const {
//   reducer,
//   actions: { increment, incrementBy },
// } = createSlice({
//   name: 'counter',
//   initialState: {
//     count: 0,
//   },
//   handlers: {
//     increment: state => ({ count: state.count + 1 }),
//     incrementBy: (state, change: number) => ({ count: state.count + change }),
//   },
// })

// reducer({ count: 0 }, { type: '1' })

// increment()
// incrementBy(3)

// const testHandlers = {
//   increment: (state) => ({ count: state.count + 1 }),
//   incrementBy: (state, change: number) => ({ count: state.count + change }),
// }
