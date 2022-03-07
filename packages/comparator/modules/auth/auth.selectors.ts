import { createSelector } from 'reselect'
import { RootState } from '../../types'

export const selectAuthState = (state: RootState) => state.auth

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  authState => Boolean(authState),
)
