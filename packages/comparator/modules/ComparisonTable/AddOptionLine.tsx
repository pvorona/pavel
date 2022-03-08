import { pointerPosition, effect } from '@pavel/observable'
import { addOptionToCurrentComparison } from '../../modules/comparisons'
import { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  lineThickness,
  hoverTrapSizeFromOneSide,
  lineColor,
  STROKE_DASHARRAY,
  circleColor,
  textColor,
} from './constants'
import { ensureInBounds } from '@pavel/utils'
import { useAuthUser } from 'next-firebase-auth'
import { selectTableSize } from './comparisonTable.selectors'

export const AddOptionLine = memo(function AddOptionLine({
  attachment,
  index,
}: {
  attachment: 'left' | 'right'
  index: number
}) {
  const [svg, setSvg] = useState<SVGSVGElement>()
  const [button, setButton] = useState<SVGTextElement>()
  const [circle, setCircle] = useState<SVGCircleElement>()
  const { height } = useSelector(selectTableSize)
  const dispatch = useDispatch()
  const user = useAuthUser()

  useEffect(() => {
    if (!button || !circle || !svg) {
      return
    }

    return effect([pointerPosition], ({ y }) => {
      const { top } = svg.getBoundingClientRect()
      const translateY = ensureInBounds(
        y - top,
        hoverTrapSizeFromOneSide,
        Infinity,
      )

      button.style.transform = `translateY(${translateY}px)`
      circle.style.transform = `translateY(${translateY}px)`
    })
  }, [button, circle, svg])

  function onClick() {
    dispatch(addOptionToCurrentComparison({ ownerId: user.id, index }))
  }

  return (
    <svg
      onClick={onClick}
      ref={setSvg}
      height={height}
      width={`${lineThickness + 2 * hoverTrapSizeFromOneSide}px`}
      className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
      style={{
        position: 'absolute',
        top: 0,
        margin: `0 -${hoverTrapSizeFromOneSide}px`,
        ...(attachment === 'left' ? { left: 0 } : { right: 0 }),
      }}
    >
      <line
        x1={hoverTrapSizeFromOneSide}
        y1={hoverTrapSizeFromOneSide}
        x2={hoverTrapSizeFromOneSide}
        y2="100%"
        stroke={lineColor}
        strokeDasharray={STROKE_DASHARRAY}
      />
      <circle
        ref={setCircle}
        cx={hoverTrapSizeFromOneSide}
        cy={0}
        r={hoverTrapSizeFromOneSide - 1}
        stroke={circleColor}
        fill={circleColor}
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
})
