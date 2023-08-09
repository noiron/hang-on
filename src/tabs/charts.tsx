import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import BarChart from "./bar-chart"
import { timeStorage } from "~background/messages/time"
import "../style.css"

function Charts() {
  const [recordedTimes] = useStorage<{ [host: string]: number[] | number }>({
    key: "time",
    instance: timeStorage
  })
  const [chartData, setChartData] = useState([])

  const host = window.location.search.slice(6)

  // 筛选出七天之内的数据
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = []

    for (let i = 6; i >= -1; i--) {
      const day = new Date(today)
      day.setDate(today.getDate() - i)
      days.push(day)
    }

    if (!recordedTimes?.[host]) return

    const recordedHostTimes = recordedTimes[host] as number[]

    const groupTimes = new Array(7).fill(0).map(() => [])

    for (let i = 0; i < recordedHostTimes.length; i++) {
      const time = recordedHostTimes[i]
      for (let j = 0; j < 7; j++) {
        if (time >= days[j].getTime() && time < days[j + 1].getTime()) {
          groupTimes[j].push(time)
        }
      }
    }

    const chartData = []
    for (let i = 0; i < 7; i++) {
      chartData[i] = {
        time: days[i].getTime(),
        date: days[i].toLocaleDateString(),
        count: groupTimes[i].length
      }
    }

    setChartData(chartData)
  }, [recordedTimes])

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Weekly Visit Overview</h2>

      <p className="text-lg">{host}</p>

      <BarChart data={chartData} />

      {/* {recordedTimes && recordedTimes[host] && (
        <div>
          {(recordedTimes[host] as number[]).reverse().map((time, index) => {
            return (
              <div key={index}>
                {new Date(time).toLocaleDateString() +
                  " " +
                  new Date(time).toLocaleTimeString()}
              </div>
            )
          })}
        </div>
      )} */}
    </div>
  )
}

export default Charts
