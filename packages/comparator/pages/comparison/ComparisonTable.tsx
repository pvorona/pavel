import { Button } from '../../common'
import { Fragment, useEffect, useRef, useState } from 'react'
import { currentComparison, options as initialOptions } from './Comparison.data'
import styles from './Comparison.module.css'
import { Feature, Option } from '../types'
import { uuid } from '@pavel/utils'
import { pointerPosition } from '@pavel/observable'

function OptionName({ option, index }: { option: Option; index: number }) {
  return (
    <>
      {/* <button onClick={() => addOption(index)}>Add option</button> */}
      {/* <span contentEditable>{option.name}</span> */}
      <span>{option.name}</span>
      {/* <button onClick={() => addOption(index + 1)}>Add option</button>
      <button onClick={() => removeOption(option)}>X</button> */}
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

function AddFeatureLine() {
  const lineHeight = 1
  const hoverTrapSizeFromOneSide = 20
  const yTranslate = 25
  const lineColor = '#CCCCCC'
  const circleColor = '#B2B2B2'
  const textColor = '#666666'

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
        transform: `translateY(${yTranslate}px)`,
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
            <tr>
              {options.map((option, index) => (
                <th
                  key={option.id}
                  className="sticky top-0 px-3 py-4 bg-white dark:bg-[#202124] z-20"
                  style={{ width: `${100 / options.length}%` }}
                >
                  <OptionName option={option} index={index} />
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
                        <div className="flex justify-center px-12 pt-2">
                          {option.features[feature.name]}
                        </div>
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
