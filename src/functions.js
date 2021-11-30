import { timeParse, timeFormat } from 'd3-time-format'
import { format } from 'd3-format'
let d3 = { timeParse, timeFormat, format }

export function parseTime(date, format) {
  let parseTimestamp = d3.timeParse(format)
  return parseTimestamp(date)
}

let formatNumber = new Intl.NumberFormat()
export function formatThousands(value) {
  return formatNumber.format(value)
}
export let formatDateAbbr = d3.timeFormat("%b '%y")
export let formatDateShort = d3.timeFormat("%e %B '%y")
export let formatDateLong = d3.timeFormat('%e %b %Y')
export let formatDateFull = d3.timeFormat('%e %B, %Y')
export function formatMillions(value) {
  return d3.format('.1s')(value)
}

export function calculateTime(time) {
  let years = Math.floor(time / 365)
  time = time - years * 365
  let months
  if (time > 30) {
    months = Math.floor(time / 30)
  } else {
    months = 0
  }
  time = time - months * 30
  let days = Math.floor(time)

  return {
    years,
    months,
    days,
  }
}
