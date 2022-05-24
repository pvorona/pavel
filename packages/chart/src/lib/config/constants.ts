import { DeeplyOptionalChartOptions } from '../types'

const tooltipAlpha = 0.5
const yLineAlpha = 0.15
const yLabelAlpha = 1
const dark = {
  overviewEdgeAlpha: 0.3,
  overviewEdgeLightness: 65,
}

const theme = {
  body: 'linear-gradient(0deg, hsl(200deg 18% 15%), hsl(200deg 18% 20%) 50%, hsl(200deg 18% 23%) 100%)',
  background: 'hsl(198, 17%, 20%)',
  overviewBackdrop: `hsla(198, 17%,10%,0.75)`,
  overviewEdge: `hsla(198, 17%, ${dark.overviewEdgeLightness}%, ${dark.overviewEdgeAlpha})`,
  tooltipBackgroundColor: `hsla(198, 17%, 30%, 0.5)`,
  series: ['#E84A5F', '#FECEA8', '#FF847C', '#6fadec'],
  tooltipLine: `hsla(198, 17%, 77%, ${tooltipAlpha})`,
  tooltipColor: 'hsl(198, 17%, 77%)',
  x: 'hsl(198, 17%, 77%)',
  y: `hsla(198, 17%, 77%, ${yLineAlpha})`,
  yLabel: `hsla(198, 17%, 77%, ${yLabelAlpha})`,
}

export const DEFAULT_CHART_OPTIONS: DeeplyOptionalChartOptions = {
  x: {
    margin: {
      blockStart: 10,
      blockEnd: 7,
    },
    ticks: 8,
    label: {
      color: theme.x,
      fontSize: 12,
      fontFamily: 'system-ui',
    },
  },

  y: {
    color: theme.y,
    ticks: 6,
    label: {
      color: theme.yLabel,
      fontSize: 12,
      fontFamily: 'system-ui',
      margin: {
        blockEnd: 7,
        inlineStart: 10,
      },
    },
  },

  lineWidth: 1,
  lineJoin: 'bevel',
  lineCap: 'butt',

  overview: {
    height: 100,
    lineWidth: 1,
    overlayColor: theme.overviewBackdrop,
    edgeColor: theme.overviewEdge,
  },

  colors: theme.series,

  tooltip: {
    lineColor: theme.tooltipLine,
    backgroundColor: theme.tooltipBackgroundColor,
    color: theme.tooltipColor,
  },
}
