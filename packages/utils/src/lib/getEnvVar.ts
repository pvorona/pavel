import { assert, isString } from '@pavel/assert'

export function getEnvVar(name: string): string {
  const value = process.env[name]

  assert(
    isString(value),
    `Unable to find environment variable: ${name}.
${JSON.stringify(process.env, null, 2)}`,
  )

  return value as string
}
