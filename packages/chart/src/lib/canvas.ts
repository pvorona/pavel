import { createFunctions } from '@pavel/functions'
import {
  LazyObservable,
  observable,
  ObservableTag,
  observe,
  Settable,
} from '@pavel/observable'
import { merge } from '@pavel/utils'
import { DeepPartial, Lambda } from '@pavel/types'
import { Point } from './types'

export type CanvasObject<T> = LazyObservable &
  Settable<T> & {
    render: (context: CanvasRenderingContext2D) => void
  }

export type CanvasLayer = LazyObservable & {
  addObject: (object: CanvasObject<any>) => Lambda
  render: (context: CanvasRenderingContext2D) => void
}

export type Canvas = {
  readonly element: HTMLCanvasElement
  addLayer: (layer: CanvasLayer) => Lambda
}

export type InteractableObject<T> = CanvasObject<T> & {
  containsPoint: (point: Point) => boolean

  interactions?: {
    onClick?: (e: MouseEvent) => void
    onMouseOver?: (e: MouseEvent) => void
  }
}

const createCanvas = (options: DeepPartial<HTMLCanvasElement>): Canvas => {
  const canvas = merge(document.createElement('canvas'), options)
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  const layers = observable<CanvasLayer[]>([])

  function render() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    layers.get().forEach(layer => {
      layer.render(context)
    })
  }

  function addLayer(layer: CanvasLayer) {
    layers.set(oldLayers => [...oldLayers, layer])

    return () => {
      layers.set(oldLayers => oldLayers.filter(l => l !== layer))
    }
  }

  observe(layers, render, { collectValues: false })

  return {
    element: canvas,
    addLayer,
  }
}

function CanvasLayer(): CanvasLayer {
  const objects = observable<CanvasObject<unknown>[]>([])
  const observers = createFunctions<Lambda>()

  function addObject(object: CanvasObject<unknown>) {
    objects.set(oldObjects => [...oldObjects, object])

    return () => {
      objects.set(oldObjects => oldObjects.filter(o => o !== object))
    }
  }

  function render(context: CanvasRenderingContext2D) {
    objects.get().forEach(object => {
      object.render(context)
    })
  }

  observe(objects, observers.invoke, { collectValues: false })

  return {
    render,
    addObject,
    observe: observers.add,
    [ObservableTag]: true,
  }
}

const CanvasObject = <T>(
  initialState: T,
  renderArgument: (context: CanvasRenderingContext2D, state: T) => void,
): CanvasObject<T> => {
  const state = observable<T>(initialState)

  function render(context: CanvasRenderingContext2D) {
    renderArgument(context, state.get())
  }

  return {
    render,
    observe: state.observe,
    set: state.set,
    [ObservableTag]: true,
  }
}

// Usage

type Rectangle = {
  fill?: string | CanvasGradient | CanvasPattern
  x: number
  y: number
  width: number
  height: number
}

function renderRectangle(context: CanvasRenderingContext2D, state: Rectangle) {
  context.fillStyle = state.fill || '#FFF'
  context.fillRect(state.x, state.y, state.width, state.height)
}

const canvas = createCanvas({
  width: 2000,
  height: 2000,
  style: {
    position: 'fixed',
    top: `${0}`,
    left: `${0}`,
  },
})

const layer = CanvasLayer()
const object1 = CanvasObject(
  {
    x: 800,
    y: 400,
    width: 10,
    height: 10,
    fill: 'red',
  },
  renderRectangle,
)
const object2 = CanvasObject(
  {
    x: 400,
    y: 400,
    width: 10,
    height: 10,
    fill: '#3a6fcc',
  },
  renderRectangle,
)
layer.addObject(object1)
layer.addObject(object2)
canvas.addLayer(layer)

export function render() {
  object1.set(state => ({
    ...state,
    x: state.x + Math.floor(5 * Math.random()) * (Math.random() < 0.5 ? 1 : -1),
    y: state.y + Math.floor(5 * Math.random()) * (Math.random() < 0.5 ? 1 : -1),
  }))

  object2.set(state => ({
    ...state,
    x:
      state.x + Math.floor(10 * Math.random()) * (Math.random() < 0.5 ? 1 : -1),
    y:
      state.y + Math.floor(10 * Math.random()) * (Math.random() < 0.5 ? 1 : -1),
  }))

  requestAnimationFrame(render)
}

document.body.appendChild(canvas.element)
