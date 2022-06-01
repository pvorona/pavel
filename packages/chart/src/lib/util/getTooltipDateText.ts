import { MONTHS } from '../components/constants'

export function getTooltipDateText(timestamp: number) {
  // TODO
  // - Cache Date objects
  const dateObject = new Date(timestamp)
  const month = MONTHS[dateObject.getMonth()]
  const date = dateObject.getDate()
  const hours = dateObject.getHours()
  const minutes = String(dateObject.getMinutes()).padStart(2, '0')
  const seconds = String(dateObject.getSeconds()).padStart(2, '0')
  const year = dateObject.getFullYear()

  return `${month} ${date} ${hours}:${minutes}:${seconds}`
  // return `${month} ${date} ${year}`
}
