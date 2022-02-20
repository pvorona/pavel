export function createValue<Argument, Value>(
  createOrDefaultValue: ((argument: Argument) => Value) | Value,
  argument: Argument,
): Value {
  if (createOrDefaultValue instanceof Function) {
    return createOrDefaultValue(argument)
  }

  return createOrDefaultValue
}
