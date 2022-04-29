import { AddIcon, IconButton, RemoveIcon, SearchIcon } from '@pavel/components'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import {
  SCALE,
  selectIsSliderVisible,
  selectScale,
  selectViewMode,
  setScale,
  setTranslateX,
  setTranslateY,
  ViewMode,
} from '../../modules'
import { RangeSlider } from '../RangeSlider'
import { Surface } from '../Surface'

export function ZoomControls() {
  const viewMode = useSelector(selectViewMode)
  const scale = useSelector(selectScale)
  const isSliderVisible = useSelector(selectIsSliderVisible)
  const dispatch = useDispatch()
  const isMaxScale = scale === SCALE.MAX
  const isMinScale = scale === SCALE.MIN

  const increaseScale = () => {
    dispatch(setScale(scale + SCALE.STEP))
  }

  const decreaseScale = () => {
    dispatch(setScale(scale - SCALE.STEP))
  }

  const resetView = () => {
    dispatch(setScale(SCALE.DEFAULT))
    dispatch(setTranslateX(0))
    dispatch(setTranslateY(0))
  }

  return (
    <div
      className={classNames(
        'fixed bottom-8 right-12 text-right transition-opacity group',
        {
          'opacity-0 pointer-events-none': viewMode === ViewMode.MARKDOWN,
          'opacity-100': viewMode === ViewMode.MINDMAP,
        },
      )}
    >
      <div
        className={classNames(
          'w-[446px] mb-4 opacity-0 group-hover:opacity-100 transition-opacity',
          {
            'opacity-100': isSliderVisible,
          },
        )}
      >
        <RangeSlider
          min={SCALE.MIN}
          max={SCALE.MAX}
          value={scale}
          onInput={event =>
            dispatch(setScale(Number(event.currentTarget.value)))
          }
        />
      </div>
      <Surface className="inline-flex items-center ml-auto" rounded withBorder>
        <IconButton
          className="w-14 h-14 flex items-center justify-center text-5xl"
          onClick={decreaseScale}
          disabled={isMinScale}
        >
          <RemoveIcon />
        </IconButton>
        <IconButton
          className="h-14 flex items-center justify-center text-5xl"
          onClick={resetView}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          className="w-14 h-14 flex items-center justify-center text-5xl"
          onClick={increaseScale}
          disabled={isMaxScale}
        >
          <AddIcon />
        </IconButton>
      </Surface>
    </div>
  )
}
