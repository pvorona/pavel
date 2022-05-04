import { interpolate } from '@pavel/utils'
import { FormEvent } from 'react'
import styles from './RangeSlider.module.scss'

export type RangeSliderProps = {
  value: number
  min: number
  max: number
  steps?: number
  onInput?: (event: FormEvent<HTMLInputElement>) => void
}

const DEFAULT_STEPS = 100

const thumbSize = 32

export function RangeSlider({
  value,
  min,
  max,
  onInput,
  steps = DEFAULT_STEPS,
}: RangeSliderProps) {
  const totalWidth = 445
  const currentWidth = interpolate(
    min,
    max,
    thumbSize / 2,
    totalWidth - thumbSize / 2,
    value,
  )
  const scaleX = currentWidth / totalWidth

  return (
    <div className={styles['Root']}>
      <input
        className={styles['Input']}
        type="range"
        onInput={onInput}
        value={value}
        min={min}
        max={max}
        step={(max - min) / steps}
      />
      <div className={styles['FilledLineContainer']}>
        <div
          className={styles['FilledLine']}
          style={{
            transform: `scaleX(${scaleX})`,
          }}
        />
      </div>
    </div>
  )
}
