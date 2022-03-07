export const SIGN_IN = '/signin'
export const SIGN_UP = '/signup'
export const COMPARISON_LIST = '/comparison'
export const COMPARISON = (id: string) =>
  `/comparison/${encodeURIComponent(id)}`

export const API_SIGN_IN = '/api/signin'
export const API_SIGN_OUT = '/api/signout'
