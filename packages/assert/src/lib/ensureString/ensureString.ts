import { ensure } from '../ensure'
import { isString } from '../isString'

export const ensureString = ensure<string>(isString)
