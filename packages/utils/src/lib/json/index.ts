export function safeParse(
  value: string,
): { isSuccess: true; value: unknown } | { isSuccess: false; error: unknown } {
  try {
    return { isSuccess: true, value: JSON.parse(value) }
  } catch (error) {
    return { isSuccess: false, error }
  }
}

export function safeStringify(value: unknown):
  | {
      isSuccess: true
      value: string
    }
  | {
      isSuccess: false
      error: unknown
    } {
  try {
    return { isSuccess: true, value: JSON.stringify(value) }
  } catch (error) {
    return { isSuccess: false, error }
  }
}
