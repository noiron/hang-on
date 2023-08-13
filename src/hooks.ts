import React, { useState, useEffect, useRef } from "react"

export function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export function useTimeRangeData(recordedHostTimes, NUMBER_OF_DAYS = 7) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = []

    for (let i = NUMBER_OF_DAYS - 1; i >= -1; i--) {
      const day = new Date(today)
      day.setDate(today.getDate() - i)
      days.push(day)
    }

    const groupTimes = new Array(NUMBER_OF_DAYS).fill(0).map(() => [])

    for (let i = 0; i < recordedHostTimes.length; i++) {
      const time = recordedHostTimes[i]
      for (let j = 0; j < NUMBER_OF_DAYS; j++) {
        if (time >= days[j].getTime() && time < days[j + 1].getTime()) {
          groupTimes[j].push(time)
        }
      }
    }

    const chartData = []
    for (let i = 0; i < NUMBER_OF_DAYS; i++) {
      chartData[i] = {
        time: days[i].getTime(),
        date: days[i].toLocaleDateString(),
        count: groupTimes[i].length
      }
    }

    setChartData(chartData)
  }, [recordedHostTimes])

  return [chartData]
}
