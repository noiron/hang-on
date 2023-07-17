import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"
import hangingSlothImage from "data-base64:~assets/hanging-sloth.png"

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
      <h1>Hang On For a Moment</h1>
      <img
        src={hangingSlothImage}
        style={{
          width: 200,
          margin: 20
        }}></img>
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
              <li style={{ margin: "10px 0" }}>
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
        <p>Enter the page you want to block. Eg. twitter.com</p>
        <input
          value={site}
          style={{ width: 220 }}
          onChange={(e) => {
            setSite(e.target.value)
          }}></input>
        <button
          style={{ marginLeft: 10 }}
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
