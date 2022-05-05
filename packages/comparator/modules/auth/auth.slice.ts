import { createSlice } from '@pavel/redux-slice'
import { User } from 'firebase/auth'
import { AuthState } from './auth.types'

const authSlice = createSlice({
  name: 'auth',
  initialState: null as AuthState,
  reducers: {
    setUser: (_, user: User) => user,
  },
})

export const { setUser } = authSlice.actions

export const authReducer = authSlice.reducer
