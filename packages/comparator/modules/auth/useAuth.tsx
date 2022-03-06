import { auth } from '@pavel/comparator-shared'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './auth.slice'

export function useAuth() {
  const dispatch = useDispatch()

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      dispatch(setUser(user))
    })
  }, [])
}
