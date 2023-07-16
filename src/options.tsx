import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"

const Options = () => {
  const [waitTime, setWaitTime] = useStorage<number>("waitTime")
  const [blockedSites, setBlockedSites] = useStorage<string[]>(
    "blockedSites",
    []
  )
  const [site, setSite] = useState("")

  return (
    <div
      style={{
        margin: 20
      }}>
      <h1>Hold On For a Moment</h1>
      <p>
        <h2>Wait time</h2>
        <input
          type="number"
          min={3}
          value={waitTime}
          onChange={(e) => {
            setWaitTime(parseInt(e.target.value))
          }}
          style={{
            width: 50
          }}
        />
        <span>S</span>
      </p>

      <div>
        <h2>Blocked Sites:</h2>
        <ul>
          {blockedSites.map((site, index) => {
            return (
              <li>
                {site}
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    const newBlockedSites = [...blockedSites]
                    newBlockedSites.splice(index, 1)
                    setBlockedSites(newBlockedSites)
                  }}>
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
        <input
          value={site}
          onChange={(e) => {
            setSite(e.target.value)
          }}></input>
        <button
          onClick={() => {
            const newBlockedSites = [...blockedSites, site]
            setBlockedSites(newBlockedSites)
            setSite("")
          }}>
          Add
        </button>
      </div>
    </div>
  )
}

export default Options
