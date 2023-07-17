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
