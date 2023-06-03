import { getRandomArrayElement } from '@pavel/utils'
import { FIRST_NAMES, LAST_NAMES } from './Usernames'

export function createUsername() {
  const first = getRandomArrayElement(FIRST_NAMES)
  const last = getRandomArrayElement(LAST_NAMES)

  return `${first} ${last}`
}
