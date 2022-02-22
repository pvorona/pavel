export function createQueue() {
  return {
    tasks: [],
    isCancelledByIndex: {},
  }
}
