type Theme = {
  body?: string
  lineWidth?: number
  overviewLineWidth?: number
  overviewBoxShadow?: string
  background: string
  overviewBackdrop: string
  overviewEdge: string
  series: string[]
  tooltipLine: string
  tooltipBackgroundColor: string
  tooltipColor: string
  x: string
  y: string
  yLabel: string
}

const tooltipAlpha = 0.5
const yLineAlpha = 0.15
const yLabelAlpha = 1
const dark = {
  overviewEdgeAlpha: 0.3,
  overviewEdgeLightness: 65,
}

const themes: Theme[] = [
  // {
  //   background: `hsla(150, 6%, 25%, 1)`,
  //   overviewBackdrop: `hsla(150, 6%, 10%, 0.75)`,
  //   overviewEdge: `hsla(150, 6%, ${dark.overviewEdgeLightness}%, ${dark.overviewEdgeAlpha})`,
  //   tooltipLine: `hsla(150, 6%, 35%, ${tooltipAlpha})`,
  //   tooltipBackgroundColor: `hsla(150, 6%, 30%, 0.5)`,
  //   tooltipColor: '#afb3b1',
  //   series: ['#7ab885', '#e75a5a'],
  //   x: 'hsl(150, 3%, 69%)',
  //   y: `hsla(150, 3%, 69%, ${yLineAlpha})`,
  //   yLabel: `hsla(150, 3%, 69%, ${yLabelAlpha})`,
  // },
  // {
  //   body: 'linear-gradient(0deg, hsl(0, 0%, 20%), hsl(0, 0%, 30%))',
  //   background: 'hsl(240, 0%, 25%)',
  //   overviewBackdrop: `hsla(240,0%,10%,0.75)`,
  //   overviewEdge: `hsla(240,0%, ${dark.overviewEdgeLightness}%, ${dark.overviewEdgeAlpha})`,
  //   series: ['#FFBD69', '#ef7171', '#543864'],
  //   tooltipLine: `hsla(0, 0%, 93%, ${tooltipAlpha})`,
  //   tooltipBackgroundColor: `hsla(240,0%,30%,0.5)`,
  //   tooltipColor: '#FFBD69',
  //   x: 'hsl(34, 40%, 85%)',
  //   y: `hsla(34, 40%, 85%, ${yLineAlpha})`,
  //   yLabel: `hsla(34, 40%, 85%, ${yLabelAlpha})`,
  // },
  // {
  //   background: 'hsl(222, 20%, 22%)',
  //   overviewBackdrop: `hsla(222, 20%, 10%,0.75)`,
  //   overviewEdge: `hsla(222, 20%, ${dark.overviewEdgeLightness}%, ${dark.overviewEdgeAlpha})`,
  //   tooltipBackgroundColor: `hsla(222, 20%,30%,0.5)`,
  //   series: ['#574B90', '#9E579D', '#FC85AE'],
  //   tooltipLine: `hsla(222, 20%, 77%, ${tooltipAlpha})`,
  //   tooltipColor: 'hsl(222, 20%, 77%)',
  //   x: 'hsl(222, 20%, 77%)',
  //   y: `hsla(222, 20%, 77%, ${yLineAlpha})`,
  //   yLabel: `hsla(222, 20%, 77%, ${yLabelAlpha})`,
  // },
  {
    body: 'linear-gradient(0deg, hsl(200deg 18% 15%), hsl(200deg 18% 20%) 50%, hsl(200deg 18% 23%) 100%)',
    background: 'hsl(198, 17%, 20%)',
    overviewBackdrop: `hsla(198, 17%,10%,0.75)`,
    overviewEdge: `hsla(198, 17%, ${dark.overviewEdgeLightness}%, ${dark.overviewEdgeAlpha})`,
    tooltipBackgroundColor: `hsla(198, 17%, 30%, 0.5)`,
    series: ['#FECEA8', '#FF847C', '#6fadec', '#E84A5F'],
    tooltipLine: `hsla(198, 17%, 77%, ${tooltipAlpha})`,
    tooltipColor: 'hsl(198, 17%, 77%)',
    x: 'hsl(198, 17%, 77%)',
    y: `hsla(198, 17%, 77%, ${yLineAlpha})`,
    yLabel: `hsla(198, 17%, 77%, ${yLabelAlpha})`,
  },
  // {
  //   body: 'linear-gradient(0deg, hsl(224, 8%, 26%), hsl(224, 8%, 32%))',
  //   background: 'hsl(224, 8%, 26%)',
  //   overviewBackdrop: `hsla(224, 8%,10%,0.75)`,
  //   overviewEdge: `hsla(224, 8%, ${dark.overviewEdgeLightness}%, ${dark.overviewEdgeAlpha})`,
  //   tooltipBackgroundColor: `hsla(224, 8%, 30%, 0.5)`,
  //   // series: ["#FF9999", "#FFC8C8"],
  //   series: ['#FF9999', '#b3adff'],
  //   tooltipLine: `hsla(198, 17%, 77%, ${tooltipAlpha})`,
  //   tooltipColor: 'hsl(224, 8%, 77%)',
  //   x: 'hsl(224, 8%, 77%)',
  //   y: `hsla(224, 8%, 77%, ${yLineAlpha})`,
  //   yLabel: `hsla(224, 8%, 77%, ${yLabelAlpha})`,
  // },
  // {
  //   background: 'hsl(0, 0%, 100%)',
  //   series: ['#d85c7b', '#2EB086'],
  //   overviewBackdrop: `hsla(0, 0%, 80%, 0.45)`,
  //   overviewEdge: `hsla(0, 0%, 10%, 0.25)`,
  //   tooltipLine: `hsla(0, 0%, 77%, ${tooltipAlpha})`,
  //   tooltipBackgroundColor: `hsla(0, 0%, 100%, 0.75)`,
  //   x: 'hsl(0, 0%, 35%)',
  //   y: `hsla(0, 0%, 35%, ${yLineAlpha})`,
  //   yLabel: `hsla(0, 0%, 35%, ${yLabelAlpha})`,
  //   tooltipColor: 'hsl(0, 0%, 35%)',
  //   lineWidth: 2,
  //   overviewBoxShadow: 'inset 0px 0 0 1px hsl(0deg 0% 75%)',
  // },
]

function selectRandomTheme(): Theme {
  const themeIndex = Math.floor(Math.random() * themes.length)
  console.log(`Selected theme: ${themeIndex}`)
  return themes[themeIndex]
}

export const theme = selectRandomTheme()
