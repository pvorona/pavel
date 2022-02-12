import { QueueByPriority } from "../types";
import { RENDER_PRIORITIES_IN_ORDER } from "../constants";
import { createQueue } from "../createQueue";

export function initQueue() {
  return RENDER_PRIORITIES_IN_ORDER.reduce(
    (queue, priority) => ({
      ...queue,
      [priority]: createQueue(),
    }),
    {} as QueueByPriority,
  )
}
