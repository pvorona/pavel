import { Button } from '../../common'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { currentComparison, options as initialOptions } from './Comparison.data'
import styles from './Comparison.module.css'
import { Feature, Option } from '../types'
import { uuid } from '@pavel/utils'
import { effect, pointerPosition, windowHeight } from '@pavel/observable'
import classNames from 'classnames'

const ENTER = 'Enter'
const ESCAPE = 'Escape'

function TextField({
  className,
  ...props
}: {
  className?: string
  onInput: (e: React.FormEvent<HTMLSpanElement>) => void
  children: React.ReactNode
}) {
  const [span, setSpan] = useState<HTMLSpanElement | undefined>()

  function onKeyDown(e: React.KeyboardEvent) {
    if (!span) {
      return
    }

    if (e.code === ENTER) {
      span.blur()
    }

    if (e.code === ESCAPE) {
      span.blur()
    }
  }

  return (
    <span
      {...props}
      ref={setSpan}
      className={classNames(className, 'rounded', styles.TextField)}
      contentEditable
      onKeyDown={onKeyDown}
      suppressContentEditableWarning={true}
    />
  )
}

function OptionHeader({
  option,
  index,
  isLast,
}: {
  option: Option
  index: number
  isLast: boolean
}) {
  return (
    <>
      <AddOptionLine attachment="left" />
      <TextField
        className="px-3 py-4 w-full inline-block"
        onInput={console.log}
      >
        {option.name}
      </TextField>
      {isLast && <AddOptionLine attachment="right" />}
    </>
  )
}

function FeatureHeader({ feature }: { feature: Feature }) {
  return (
    // <div className="inline-block sticky left-0 px-3 bg-white dark:bg-[#202124]">
    <div className="inline-block px-3">
      {/* <span contentEditable>{feature.name}</span> */}
      <span>{feature.name}</span>
      {/* <button onClick={() => removeFeature(feature)}>X</button>
  <button onClick={() => toggleVisibility(feature)}>
    Toggle visibility
  </button> */}
      {feature.description && (
        // <div contentEditable>{feature.description}</div>
        <div>{feature.description}</div>
      )}
    </div>
  )
}

const lineHeight = 1
const hoverTrapSizeFromOneSide = 20
const yTranslate = '20px'
const lineColor = '#CCCCCC'
const circleColor = '#B2B2B2'
const textColor = '#666666'

function AddOptionLine({ attachment }: { attachment: 'left' | 'right' }) {
  const [svg, setSvg] = useState<SVGSVGElement>()
  const [button, setButton] = useState<SVGTextElement>()
  const [circle, setCircle] = useState<SVGCircleElement>()

  useEffect(() => {
    if (!button || !circle || !svg) {
      return
    }

    return pointerPosition.observe(({ y }) => {
      const { top } = svg.getBoundingClientRect()

      button.style.transform = `translateY(${y - top}px)`
      circle.style.transform = `translateY(${y - top}px)`
    })
  }, [button, circle, svg])

  useEffect(() => {
    if (!svg) {
      return
    }

    return effect([windowHeight], height => {
      svg.setAttribute('height', `${height}`)
    })
  }, [svg])

  return (
    <svg
      ref={setSvg}
      // Init with 0 to match the hydrated server state
      height={0}
      width={`${lineHeight + 2 * hoverTrapSizeFromOneSide}px`}
      className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
      style={{
        position: 'absolute',
        top: 0,
        margin: `0 -${hoverTrapSizeFromOneSide}px`,
        ...(attachment === 'left' ? { left: 0 } : { right: 0 }),
        // transform: 'translateX(-50%)',
      }}
    >
      <line
        x1={hoverTrapSizeFromOneSide}
        y1="0"
        x2={hoverTrapSizeFromOneSide}
        y2="100%"
        stroke={lineColor}
        strokeDasharray="20"
      />
      <circle
        ref={setCircle}
        cx={hoverTrapSizeFromOneSide}
        cy={0}
        r={hoverTrapSizeFromOneSide - 1}
        stroke={circleColor}
        fill="white"
      ></circle>
      <text
        ref={setButton}
        x={hoverTrapSizeFromOneSide}
        y={0}
        dominantBaseline="middle"
        alignmentBaseline="central"
        color={textColor}
        textAnchor="middle"
      >
        +
      </text>
    </svg>
  )
}

function AddFeatureLine() {
  const [svg, setSvg] = useState<SVGSVGElement>()
  const [button, setButton] = useState<SVGTextElement>()
  const [circle, setCircle] = useState<SVGCircleElement>()

  useEffect(() => {
    if (!button || !circle || !svg) {
      return
    }

    return pointerPosition.observe(({ x }) => {
      const { left } = svg.getBoundingClientRect()

      button.style.transform = `translateX(${x - left}px)`
      circle.style.transform = `translateX(${x - left}px)`
    })
  }, [button, circle, svg])

  return (
    <svg
      ref={setSvg}
      width="100%"
      height={`${lineHeight + 2 * hoverTrapSizeFromOneSide}px`}
      className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
      style={{
        transform: `translateY(${yTranslate})`,
        margin: `-${hoverTrapSizeFromOneSide}px 0`,
      }}
    >
      <line
        x1="0"
        y1={hoverTrapSizeFromOneSide}
        x2="100%"
        y2={hoverTrapSizeFromOneSide}
        stroke={lineColor}
        strokeDasharray="20"
      />
      <circle
        ref={setCircle}
        cx={0}
        cy={hoverTrapSizeFromOneSide}
        r={hoverTrapSizeFromOneSide - 1}
        stroke={circleColor}
        fill="white"
      ></circle>
      <text
        ref={setButton}
        x={0}
        y={hoverTrapSizeFromOneSide}
        dominantBaseline="middle"
        alignmentBaseline="central"
        color={textColor}
        textAnchor="middle"
      >
        +
      </text>
    </svg>
  )
}

export function ComparisonTable() {
  const scrollContainerRef = useRef<HTMLDivElement | undefined>()
  const [features, setFeatures] = useState(currentComparison.features)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false)
  const [options, setOptions] = useState(initialOptions)

  function removeFeature(feature: Feature) {
    setFeatures(features => features.filter(f => f !== feature))
  }

  function toggleVisibility(feature: Feature) {
    const newFeature: Feature = {
      ...feature,
      expanded: !feature.expanded,
    }
    setFeatures(features => features.map(f => (f === feature ? newFeature : f)))
  }

  function addFeature() {
    const newFeature: Feature = {
      name: `Feature ${features.length}`,
      type: 'text',
      description: 'sample',
      expanded: true,
    } as const
    setFeatures(features => [...features, newFeature])
    setShouldScrollToBottom(true)
  }

  function addOption(index: number) {
    const newOption: Option = {
      id: uuid(),
      name: `Option ${index}`,
      features: {},
    }

    const newOptions = [...options]
    newOptions.splice(index, 0, newOption)

    setOptions(newOptions)
  }

  function removeOption(option: Option) {
    setOptions(options => options.filter(o => o !== option))
  }

  useEffect(() => {
    if (shouldScrollToBottom && scrollContainerRef.current) {
      setShouldScrollToBottom(false)

      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight
    }
  }, [shouldScrollToBottom])

  return (
    // <div className='mt-8 flex flex-col items-center overflow-hidden'>
    <div className="flex flex-col items-center overflow-hidden">
      <div
        className={`overflow-auto w-full ${styles.scrollContainer}`}
        ref={scrollContainerRef}
      >
        <table className="min-w-[640px] mb-16 mx-auto">
          <thead>
            <tr
              className="sticky top-0 z-20 bg-white dark:bg-[#202124]"
              style={{
                backgroundImage:
                  'linear-gradient(to top, hsl(0deg 0% 0% / 10%) 1px, transparent 0)',
              }}
            >
              {options.map((option, index) => (
                <th
                  key={option.id}
                  className="relative"
                  style={{ width: `${100 / options.length}%` }}
                >
                  <OptionHeader
                    option={option}
                    index={index}
                    isLast={index === options.length - 1}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <Fragment key={`${feature.name}${index}`}>
                {index === 0 && (
                  <tr className="relative z-10">
                    <td colSpan={options.length}>
                      <AddFeatureLine />
                    </td>
                  </tr>
                )}

                {/* <tr className={`sticky left-3 top-[56px]`}> */}
                <tr className={`top-[56px]`}>
                  <td className="pt-10" colSpan={options.length}>
                    <FeatureHeader feature={feature} />
                  </td>
                </tr>

                {feature.expanded && (
                  <tr>
                    {options.map(option => (
                      <td
                        key={`${feature}-${option.id}`}
                        style={{ width: `${100 / options.length}%` }}
                        className="align-top"
                      >
                        <TextField
                          onInput={console.log}
                          className="flex justify-center px-12 py-2"
                        >
                          {option.features[feature.name]}
                        </TextField>
                      </td>
                    ))}
                  </tr>
                )}

                <tr className="relative z-10">
                  <td colSpan={options.length}>
                    <AddFeatureLine />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="w-full mt-auto px-3 mb-3">
        <Button
          onClick={addFeature}
          className="bg-black text-white py-1 px-8 h-12 whitespace-nowrap w-full"
        >
          + Add Feature
        </Button>
      </div> */}
    </div>
  )
}
