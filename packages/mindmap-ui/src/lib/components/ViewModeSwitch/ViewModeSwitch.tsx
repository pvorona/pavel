import { Button, MarkdownIcon, MindMapIcon, Variant } from '@pavel/components'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setViewMode as setViewModeAction,
  selectViewMode,
  ViewMode,
} from '../../modules'
import { Surface } from '../Surface'

const activeStyles = {
  '--background-light-hover': 'var(--background-light-default)',
  '--background-dark-hover': 'var(--background-light-default)',
  '--border-width': '0px',
  '--font-weight': 700,
}

const notActiveStyles = {
  '--background-light-default': 'white',
  '--background-dark-default': 'white',
  '--background-light-hover': 'hsl(var(--c-1-95))',
  '--background-dark-hover': 'hsl(var(--c-1-95))',
  '--color-light-default': 'hsl(var(--c-1-25))',
  '--color-dark-default': 'hsl(var(--c-1-25))',
  '--color-light-hover': 'hsl(var(--c-1-20))',
  '--color-dark-hover': 'hsl(var(--c-1-20))',
  '--border-width': '0px',
  '--font-weight': 700,
}

export const ViewModeSwitch = memo(function ViewModeSwitch() {
  const viewMode = useSelector(selectViewMode)
  const dispatch = useDispatch()

  function handleMindMapClick() {
    if (viewMode === ViewMode.MINDMAP) {
      return
    }

    dispatch(setViewModeAction(ViewMode.MINDMAP))
  }

  function handleMarkdownClick() {
    if (viewMode === ViewMode.MARKDOWN) {
      return
    }

    dispatch(setViewModeAction(ViewMode.MARKDOWN))
  }

  const mindmapButtonStyleProps = (() => {
    const isActive = viewMode === ViewMode.MINDMAP
    const variant = Variant.Filled
    const style = isActive ? activeStyles : notActiveStyles

    return {
      variant,
      style,
    }
  })()
  const markdownButtonStyleProps = (() => {
    const isActive = viewMode === ViewMode.MARKDOWN
    const variant = Variant.Filled
    const style = isActive ? activeStyles : notActiveStyles

    return {
      variant,
      style,
    }
  })()

  return (
    <Surface className="fixed top-8 left-12 py-1 px-1" rounded withBorder>
      <Button rounded onClick={handleMindMapClick} {...mindmapButtonStyleProps}>
        <MindMapIcon className="-ml-3 mr-3" /> Mind Map
      </Button>
      <Button
        rounded
        onClick={handleMarkdownClick}
        {...markdownButtonStyleProps}
      >
        <MarkdownIcon className="-ml-3 mr-3" /> Markdown
      </Button>
    </Surface>
  )
})
