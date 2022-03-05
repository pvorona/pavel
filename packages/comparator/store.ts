import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { optionsReducer } from './modules/options'
import { comparisonsReducer } from './modules/comparisons'
import { batchReducer, batchMiddleware } from '@pavel/redux-slice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
}

export const store = createStore(
  // persistReducer(
  // persistConfig,
  batchReducer(
    combineReducers({
      options: optionsReducer,
      comparisons: comparisonsReducer,
    }),
  ),
  // ),
  applyMiddleware(batchMiddleware, thunk),
)

// export const persistor = persistStore(store)
