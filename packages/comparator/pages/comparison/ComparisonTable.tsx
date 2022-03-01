import { Button } from '../../common'
import { useDispatch, useSelector } from 'react-redux'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import styles from './Comparison.module.css'
import { Option, selectCurrentComparisonOptions } from '../../modules/options'
import {
  Feature,
  selectCurrentComparison,
  addFeatureToCurrentComparison,
  addOptionToCurrentComparison,
  removeFeatureFromCurrentComparison,
  toggleFeatureExpandedInCurrentComparison,
  toggleDescriptionExpandedInCurrentComparison,
  removeOptionFromCurrentComparison,
} from '../../modules/comparisons'
import { animateOnce } from '@pavel/utils'
import { effect, pointerPosition, windowHeight } from '@pavel/observable'
import classNames from 'classnames'

const ENTER = 'Enter'
const ESCAPE = 'Escape'

function TextField({
  className,
  ...props
}: {
  className?: string
  placeholder?: string
  onInput?: (e: React.FormEvent<HTMLSpanElement>) => void
  children: React.ReactNode
}) {
  const [span, setSpan] = useState<HTMLSpanElement | undefined>()

  function onKeyDown(e: React.KeyboardEvent) {
    if (!span) {
      return
    }

    if (e.code === ENTER) {
      span.blur()
      animateOnce(span, 'animate-success')
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

function OptionActions({ option }: { option: Option }) {
  const dispatch = useDispatch()

  function onRemoveOptionClick() {
    dispatch(removeOptionFromCurrentComparison(option.id))
  }

  return (
    <div className={classNames('flex py-2 px-8')}>
      <IconButton />
      <IconButton className="ml-2" />
      <IconButton color="red" onClick={onRemoveOptionClick} className="ml-2" />
    </div>
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
      <AddOptionLine attachment="left" index={index} />
      <TextField
        className="px-3 py-4 w-full inline-block peer"
        onInput={console.log}
      >
        {option.name}
      </TextField>
      <div className="absolute bottom-0 translate-y-full invisible hover:visible peer-hover:visible left-1/2 -translate-x-1/2">
        <OptionActions option={option} />
      </div>
      {isLast && <AddOptionLine attachment="right" index={index + 1} />}
    </>
  )
}

function FeatureActions({
  index,
  feature,
  className,
  ...props
}: { index: number; feature: Feature } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const dispatch = useDispatch()

  function onToggleExpandedClick() {
    dispatch(toggleFeatureExpandedInCurrentComparison(index))
  }

  function onRemoveFeatureClick() {
    dispatch(removeFeatureFromCurrentComparison(index))
  }

  function onDescriptionExpandedClick() {
    dispatch(toggleDescriptionExpandedInCurrentComparison(index))
  }

  return (
    <div
      className={classNames(
        'flex ml-2 opacity-0 transition-opacity',
        className,
      )}
      {...props}
    >
      <IconButton color="gray" onClick={onToggleExpandedClick} />
      {feature.isExpanded && (
        <IconButton
          color="green"
          onClick={onDescriptionExpandedClick}
          className="ml-2"
        />
      )}
      <IconButton color="red" onClick={onRemoveFeatureClick} className="ml-2" />
    </div>
  )
}

function IconButton({
  className,
  color = 'white',
  ...props
}: {
  color?: 'red' | 'white' | 'gray' | 'green'
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={classNames(
        'inline-block w-5 h-5 border border-current rounded-full bg-current',
        className,
        {
          'text-red-500': color === 'red',
          'text-white': color === 'white',
          'text-gray-500': color === 'gray',
          'text-green-400': color === 'green',
        },
      )}
      {...props}
    />
  )
}

function FeatureHeader({
  feature,
  index,
}: {
  feature: Feature
  index: number
}) {
  const isDescriptionVisible =
    feature.isExpanded && feature.isDescriptionExpanded

  return (
    // <div className="inline-block sticky left-0 px-3 bg-white dark:bg-[#202124]">
    <div className="inline-block sticky left-0">
      <div className="flex flex-row items-center group">
        <TextField
          placeholder="Feature name..."
          className={classNames('px-3 py-2', {
            'opacity-50': !feature.isExpanded,
          })}
        >
          {feature.name}
        </TextField>
        <FeatureActions
          index={index}
          feature={feature}
          className="group-hover:opacity-100"
        />
      </div>
      {isDescriptionVisible && (
        <TextField
          placeholder="Feature description..."
          className="px-3 inline-block min-w-[100px] text-xs"
        >
          {feature.description}
        </TextField>
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

function AddOptionLine({
  attachment,
  index,
}: {
  attachment: 'left' | 'right'
  index: number
}) {
  const [svg, setSvg] = useState<SVGSVGElement>()
  const [button, setButton] = useState<SVGTextElement>()
  const [circle, setCircle] = useState<SVGCircleElement>()
  const dispatch = useDispatch()

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

  function onClick() {
    dispatch(addOptionToCurrentComparison(index))
  }

  return (
    <svg
      onClick={onClick}
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

function AddFeatureLine({ index }: { index: number }) {
  const dispatch = useDispatch()
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

  function onClick() {
    dispatch(addFeatureToCurrentComparison(index))
  }

  return (
    <svg
      onClick={onClick}
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
  const options = useSelector(selectCurrentComparisonOptions)
  const currentComparison = useSelector(selectCurrentComparison)

  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | undefined>()

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
            {currentComparison.features.map((feature, index) => (
              <Fragment key={`${feature.name}${index}`}>
                {index === 0 && (
                  <tr className="relative z-10">
                    <td colSpan={options.length}>
                      <AddFeatureLine index={index} />
                    </td>
                  </tr>
                )}

                <tr className={`top-[58px]`}>
                  <td className="pt-10" colSpan={options.length}>
                    <FeatureHeader index={index} feature={feature} />
                  </td>
                </tr>

                {feature.isExpanded && (
                  <tr>
                    {options.map(option => (
                      <td
                        key={`${feature}-${option.id}`}
                        style={{ width: `${100 / options.length}%` }}
                        className="align-top"
                      >
                        <TextField
                          placeholder="Option feature value..."
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
                    <AddFeatureLine index={index + 1} />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
