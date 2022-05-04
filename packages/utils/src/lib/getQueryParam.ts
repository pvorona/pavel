import { isBrowser } from './isBrowser'

export function getQueryParam(
  name: string,
  url = isBrowser ? window.location.search : '',
) {
  const params = new URLSearchParams(url)

  return params.getAll(name)
}
