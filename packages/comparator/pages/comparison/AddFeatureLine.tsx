import { effect, pointerPosition } from '@pavel/observable'
import { addFeatureToCurrentComparison } from '../../modules/comparisons'
import { memo, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  lineThickness,
  hoverTrapSizeFromOneSide,
  yTranslate,
  lineColor,
  STROKE_DASHARRAY,
  circleColor,
  textColor,
} from './constants'

export const AddFeatureLine = memo(function AddFeatureLine({
  index,
}: {
  index: number
}) {
  const dispatch = useDispatch()
  const [svg, setSvg] = useState<SVGSVGElement>()
  const [button, setButton] = useState<SVGTextElement>()
  const [circle, setCircle] = useState<SVGCircleElement>()

  useEffect(() => {
    if (!button || !circle || !svg) {
      return
    }

    return effect([pointerPosition], ({ x }) => {
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
      height={`${lineThickness + 2 * hoverTrapSizeFromOneSide}px`}
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
        strokeDasharray={STROKE_DASHARRAY}
      />
      <circle
        ref={setCircle}
        cx={0}
        cy={hoverTrapSizeFromOneSide}
        r={hoverTrapSizeFromOneSide - 1}
        stroke={circleColor}
        fill={circleColor}
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
})
