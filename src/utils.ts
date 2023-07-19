export function diffTime(ms: number) {
  ms = Math.floor(ms / 1000)
  const seconds = ms % 60
  ms = (ms - seconds) / 60
  const minutes = ms % 60
  ms = (ms - minutes) / 60
  const hours = ms

  return {
    hours,
    minutes,
    seconds
  }
}

export function formatTime(time: {
  hours: number
  minutes: number
  seconds: number
}) {
  const h = time.hours > 0 ? `${time.hours} h ` : ""
  const m = time.minutes > 0 ? `${time.minutes} m` : ""
  const s = time.seconds > 0 ? `${time.seconds} s` : ""
  return `${h} ${m} ${s}`
}

function isSameDay(ts1: number, ts2: number) {
  const date1 = new Date(ts1)
  const date2 = new Date(ts2)
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function isToday(ts: number) {
  return isSameDay(ts, Date.now())
}
