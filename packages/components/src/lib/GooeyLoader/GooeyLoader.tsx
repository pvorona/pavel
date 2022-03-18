import classNames from 'classnames'
import styles from './GooeyLoader.module.scss'

export function Circle() {
  return (
    <circle
      style={{
        filter: 'url(#goo)',
      }}
    />
  )
}

const R = 20
const X_STEP = 60
const W = 320
const H = 500
const CY = 250

export function GooeyLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <GooeyLoaderComponent />
    </div>
  )
}

export function GooeyLoaderComponent() {
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          <filter id="f4" x="0" y="0" width="200%" height="200%">
            <feOffset result="offOut" in="SourceGraphic" dx="0" dy="5" />
            <feColorMatrix
              result="matrixOut"
              in="offOut"
              type="matrix"
              values="0.8 0 0 0 0 0 0.8 0 0 0 0 0 0.8 0 0 0 0 0 1 0"
            />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="luminosity" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          filter: 'url(#f4)',
        }}
      >
        <div
          style={{
            filter: 'url(#goo)',
          }}
        >
          <div className={classNames(styles['Circle'], styles['Main'])} />
          <div className={classNames(styles['Circle'], styles['Small'])} />
          <div className={classNames(styles['Circle'], styles['Small'])} />
          <div className={classNames(styles['Circle'], styles['Small'])} />
        </div>
      </div>
    </>
  )
}
