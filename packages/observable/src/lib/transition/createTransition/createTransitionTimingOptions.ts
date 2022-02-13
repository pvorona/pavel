import { TransitionTimingOptions, TransitionTiming } from "../types"
import { DEFAULT_EASING } from "./constants"
import { getEasing } from "./getEasing"

export function createTransitionTimingOptions(
  optionsOrDuration: TransitionTimingOptions,
): TransitionTiming {
  if (typeof optionsOrDuration === 'number') {
    return {
      duration: optionsOrDuration,
      easing: DEFAULT_EASING,
    }
  }

  const easing = getEasing(optionsOrDuration)

  return { ...optionsOrDuration, easing }
}
