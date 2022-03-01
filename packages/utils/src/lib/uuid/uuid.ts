export function uuid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window.crypto as any).randomUUID()
}
