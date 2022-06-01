import { DEFAULT_MARKER_VISIBLE } from '../components/constants'
import { ExternalMarker } from '../types'

export function getMarkerVisibility(marker: ExternalMarker): boolean {
  if (marker.type === 'group') {
    return Boolean(marker.visible)
  }

  return DEFAULT_MARKER_VISIBLE
}
