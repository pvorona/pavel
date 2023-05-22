import { ensureDefined, ensureNonNull } from '@pavel/assert'
import { observable } from '@pavel/observable'

const config = {
  cellSizePx: 25,
  worldSizeCells: {
    horizontal: 15,
    vertical: 15,
  },
  timeQuantMs: 125,
} as const

type Velocity = { readonly x: number; readonly y: number }

const velocities = {
  motionless: { x: 0, y: 0 },
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
} as const

function main() {
  const canvas = document.createElement('canvas')
  const root = ensureNonNull(document.getElementById('root'))
  const context = ensureNonNull(canvas.getContext('2d'))

  const width = config.worldSizeCells.horizontal * config.cellSizePx
  const height = config.worldSizeCells.vertical * config.cellSizePx

  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio

  canvas.style.border = '1px solid black'

  const velocity = observable<Velocity>(velocities.motionless)
  let nextVelocity: Velocity = velocities.motionless
  const snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
  ]

  setInterval(() => {
    velocity.set(nextVelocity)

    const head = ensureDefined(snake.at(-1))
    const nextHead = {
      x:
        (head.x + velocity.get().x + config.worldSizeCells.horizontal) %
        config.worldSizeCells.horizontal,
      y:
        (head.y + velocity.get().y + config.worldSizeCells.vertical) %
        config.worldSizeCells.vertical,
    }
    snake.push(nextHead)
    snake.shift()
    render()
  }, config.timeQuantMs)

  document.addEventListener('keydown', function (event) {
    if (['ArrowLeft', 'a'].includes(event.key)) {
      if (!areOpposite(velocity.get(), velocities.left)) {
        nextVelocity = velocities.left
      }
    }
    if (['ArrowRight', 'd'].includes(event.key)) {
      if (!areOpposite(velocity.get(), velocities.right)) {
        nextVelocity = velocities.right
      }
    }
    if (['ArrowUp', 'w'].includes(event.key)) {
      if (!areOpposite(velocity.get(), velocities.up)) {
        nextVelocity = velocities.up
      }
    }
    if (['ArrowDown', 's'].includes(event.key)) {
      if (!areOpposite(velocity.get(), velocities.down)) {
        nextVelocity = velocities.down
      }
    }
  })

  root.appendChild(canvas)

  function render() {
    context.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio)

    // Render world
    for (let x = 0; x < config.worldSizeCells.horizontal; x++) {
      for (let y = 0; y < config.worldSizeCells.vertical; y++) {
        context.strokeRect(
          x * config.cellSizePx * devicePixelRatio,
          y * config.cellSizePx * devicePixelRatio,
          config.cellSizePx * devicePixelRatio,
          config.cellSizePx * devicePixelRatio,
        )
      }
    }

    // Render snake
    for (let i = 0; i < snake.length; i++) {
      const { x, y } = snake[i]

      context.fillStyle = 'red'
      context.fillRect(
        x * config.cellSizePx * devicePixelRatio,
        y * config.cellSizePx * devicePixelRatio,
        config.cellSizePx * devicePixelRatio,
        config.cellSizePx * devicePixelRatio,
      )
    }
  }
}

main()

function areOpposite(a: Velocity, b: Velocity): boolean {
  return (a.x === -b.x && a.y === b.y) || (a.x === b.x && a.y === -b.y)
}
