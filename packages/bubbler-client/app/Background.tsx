'use client'

import { useEffect, useRef } from 'react'
import styles from './Background.module.scss'
import { getRandomArrayElement } from '@pavel/utils'
import { BUBBLES, BubbleStyle } from './Bubbles'

const INTERVAL = {
  MIN: 200,
  MAX: 400,
}

export function Background() {
  return (
    <div className={styles.Container}>
      <Bubbles className={styles.Left} />
      <Bubbles className={styles.Right} />
    </div>
  )
}

function getRandomNumberInRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function Bubbles({ className }: { readonly className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timeout: number
    let bubbleStyle: BubbleStyle | null = null

    function animateBubble() {
      if (!ref.current) {
        return
      }

      let nextStyle = getRandomBubbleStyle()
      while (bubbleStyle === nextStyle) {
        nextStyle = getRandomBubbleStyle()
      }
      bubbleStyle = nextStyle
      const bubble = createBubble({ style: bubbleStyle })

      bubble.addEventListener('animationend', () => {
        bubble.parentElement?.removeChild(bubble)
      })
      ref.current.prepend(bubble)

      const interval = Math.floor(
        getRandomNumberInRange(INTERVAL.MIN, INTERVAL.MAX),
      )
      timeout = window.setTimeout(animateBubble, interval)
    }

    animateBubble()

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return <div className={className} ref={ref} />
}

function getRandomBubbleStyle() {
  return getRandomArrayElement(BUBBLES)
}

type BubbleProps = {
  readonly style: BubbleStyle
}

function createBubble({ style }: BubbleProps) {
  // const left = 30 + Math.floor(Math.random() * 40)
  const left = Math.floor(getRandomNumberInRange(30, 70))
  // const initialScale = Math.floor(Math.random() * 10)
  const initialScale = Math.floor(getRandomNumberInRange(0, 10))
  // const finalScale = 100 + Math.floor(Math.random() * 280)
  const finalScale = Math.floor(getRandomNumberInRange(200, 400))
  // const initialX = -60 + Math.floor(Math.random() * 120)
  const initialX = Math.floor(getRandomNumberInRange(-60, 60))
  // const finalX = -60 + Math.floor(Math.random() * 120)
  const finalX = Math.floor(getRandomNumberInRange(-120, 120))

  const div = document.createElement('div')
  div.classList.add(styles.Float)
  div.classList.add(styles.Bubble)
  div.style.setProperty('--initial-scale', String(initialScale / 100))
  div.style.setProperty('--final-scale', String(finalScale / 100))
  div.style.setProperty('--initial-x', `${initialX}px`)
  div.style.setProperty('--final-x', `${finalX}px`)
  div.style.setProperty('--bg-from', style.background.from)
  div.style.setProperty('--bg-to', style.background.to)
  div.style.setProperty('--border', style.border)
  div.style.setProperty('--left', `${left}%`)
  div.style.setProperty('--size', `100px`)
  div.style.setProperty('--viewport-h', `${document.body.offsetHeight}px`)
  return div
}
