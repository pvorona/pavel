import { isObject } from '@pavel/assert'
import { DeepPartial } from '@pavel/types'

export function merge<T extends object>(target: T, source: DeepPartial<T>): T {
  for (const key in source) {
    const value = source[key]

    if (!isObject(value)) {
      ;(target as any)[key] = value
    } else {
      if (!isObject((target as any)[key])) {
        ;(target as any)[key] = {}
      }
      merge((target as any)[key], value)
    }
  }

  return target
}

// export function isObject(item: unknown): item is object {
//   return item !== null && typeof item === 'object' && !Array.isArray(item)
// }

// export function merge<T>(target: T, ...sources: DeepPartial<T>[]): T {
//   if (!sources.length) return target
//   const source = sources.shift()

//   if (isObject(target) && isObject(source)) {
//     for (const key in source) {
//       if (isObject(source[key])) {
//         if (!target[key]) Object.assign(target, { [key]: {} })
//         merge(target[key], source[key])
//       } else {
//         Object.assign(target, { [key]: source[key] })
//       }
//     }
//   }

//   return merge(target, ...sources)
// }
