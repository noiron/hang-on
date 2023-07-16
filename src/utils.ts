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
  const h = time.hours > 0 ? `${time.hours}小时` : ""
  const m = time.minutes > 0 ? `${time.minutes}分钟` : ""
  const s = time.seconds > 0 ? `${time.seconds}秒` : ""
  return `${h}${m}${s}`
}
