/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyAction } from 'redux'
import { Draft, produce } from 'immer'

type ActionType = string | number

type ActionWithPayload<
  SliceName extends string,
  Type extends ActionType,
  Payload,
> = {
  type: ScopedActionType<SliceName, Type>
  payload: Payload
}

type ActionWithoutPayload<SliceName extends string, Type extends ActionType> = {
  type: ScopedActionType<SliceName, Type>
}

type ActionCreatorWithPayload<
  SliceName extends string,
  Type extends ActionType,
  Payload,
> = (payload: Payload) => ActionWithPayload<SliceName, Type, Payload>

type ActionCreatorWithoutPayload<
  SliceName extends string,
  Type extends ActionType,
> = () => ActionWithoutPayload<SliceName, Type>

type ActionReducerWithPayload<State, Payload> = (
  state: Draft<State>,
  payload: Payload,
) => void

type ActionReducerWithoutPayload<State> = (state: Draft<State>) => void

type ActionReducers<State> = {
  [actionType: ActionType]:
    | ActionReducerWithPayload<State, any>
    | ActionReducerWithoutPayload<State>
}

function createScopedReducers<
  State = any,
  Reducers extends ActionReducers<State> = ActionReducers<State>,
  SliceName extends string = string,
>(sliceName: SliceName, reducers: Reducers) {
  const scopedReducers = {} as Reducers

  for (const actionName in reducers) {
    const scopedActionType = createScopedActionType(sliceName, actionName)

    scopedReducers[scopedActionType] = reducers[actionName] as any
  }

  return scopedReducers
}

export function createSlice<
  State = any,
  Reducers extends ActionReducers<State> = ActionReducers<State>,
  Name extends string = string,
>({
  initialState,
  name,
  reducers = {} as Reducers,
}: {
  initialState: State
  name: Name
  reducers?: Reducers
}) {
  const scopedReducers = createScopedReducers(name, reducers)

  function reducer(state = initialState, action: AnyAction) {
    const reduce = scopedReducers[action.type]
    return typeof reduce === 'function'
      ? produce(state, draft => reduce(draft, action.payload))
      : state
  }

  const actions = extractActions(name, reducers)

  return {
    reducer,
    actions,
  }
}

// "without payload" case should be before "with payload"
// for correct inference
type ActionCreatorForReducer<
  SliceName extends string,
  ActionName extends ActionType,
  Reducer,
> = Reducer extends ActionReducerWithoutPayload<any>
  ? ActionCreatorWithoutPayload<SliceName, ActionName>
  : Reducer extends ActionReducerWithPayload<any, infer Payload>
  ? ActionCreatorWithPayload<SliceName, ActionName, Payload>
  : never

type ActionCreatorsForReducers<
  SliceName extends string,
  Reducers extends ActionReducers<any>,
> = {
  [ActionName in keyof Reducers]: ActionCreatorForReducer<
    SliceName,
    ActionName extends string | number ? ActionName : never,
    Reducers[ActionName]
  >
}

type ScopedActionType<
  SliceName extends string,
  ActionName extends ActionType,
> = `${SliceName}/${ActionName}`

function createScopedActionType<
  SliceName extends string,
  ActionName extends ActionType,
>(
  sliceName: SliceName,
  actionName: ActionName,
): ScopedActionType<SliceName, ActionName> {
  return `${sliceName}/${actionName}`
}

function extractActions<
  SliceName extends string,
  Reducers extends ActionReducers<any>,
>(
  sliceName: SliceName,
  reducers: Reducers,
): ActionCreatorsForReducers<SliceName, Reducers> {
  const actionCreators = {} as ActionCreatorsForReducers<SliceName, Reducers>

  for (const reducerName in reducers) {
    const actionType = `${sliceName}/${reducerName}` as ScopedActionType<
      SliceName,
      typeof reducerName
    >

    const actionCreator = ((payload: any) => {
      return {
        type: actionType,
        payload,
      }
    }) as ActionCreatorForReducer<
      SliceName,
      typeof actionType,
      typeof reducers[typeof actionType]
    >

    actionCreator.toString = () => actionType

    actionCreators[reducerName] = actionCreator as any
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
//   reducers: {
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
