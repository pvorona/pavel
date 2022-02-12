import { QueueByPriority } from "../types";
import { PRIORITIES_IN_ORDER } from "../constants";
import { createQueue } from "../createQueue";

export function initQueue() {
  return PRIORITIES_IN_ORDER.reduce(
    (queue, priority) => ({
      ...queue,
      [priority]: createQueue(),
    }),
    {} as QueueByPriority,
  )
}
