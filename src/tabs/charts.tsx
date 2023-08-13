import { useStorage } from "@plasmohq/storage/hook"
import BarChart from "./bar-chart"
import { timeStorage } from "~background/messages/time"
import "../style.css"
import { useTimeRangeData } from "~hooks"

const NUMBER_OF_DAYS = 15

function Charts() {
  const [recordedTimes] = useStorage<{ [host: string]: number[] | number }>({
    key: "time",
    instance: timeStorage
  })
  const host = window.location.search.slice(6)
  const [chartData] = useTimeRangeData(
    recordedTimes?.[host] || [],
    NUMBER_OF_DAYS
  )

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">
        {NUMBER_OF_DAYS} Days Visit Overview
      </h2>

      <p className="text-lg">{host}</p>

      <BarChart data={chartData} width={600} height={400} />

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
