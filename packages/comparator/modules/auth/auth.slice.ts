import { createSlice } from '@pavel/redux-slice'
import { AuthState } from './auth.types'

const authSlice = createSlice({
  name: 'auth',
  initialState: null as AuthState,
  handlers: {
    setUser: (state, user: AuthState) => user,
  },
})

export const { setUser } = authSlice.actions

export const authReducer = authSlice.reducer
