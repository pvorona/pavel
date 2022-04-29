import { assertNever } from '@pavel/assert'
import { useSelector } from 'react-redux'
import { selectViewMode, ViewMode } from '../../modules'
import { MarkdownView } from '../MarkdownView'
import { MindMapView } from '../MindMapView'

export function MainView() {
  const uiMode = useSelector(selectViewMode)

  if (uiMode === ViewMode.MINDMAP) {
    return <MindMapView />
  }

  if (uiMode === ViewMode.MARKDOWN) {
    return <MarkdownView />
  }

  assertNever(uiMode)

  return null
}
