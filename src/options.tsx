import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"
import hangingSlothImage from "data-base64:~assets/hanging-sloth.png"
import "./style.css"

const inputClassNames =
  "shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
const buttonClassNames =
  "bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded w-16"

const Options = () => {
  const [waitTime, setWaitTime] = useStorage<number>("waitTime", 10)
  const [blockedSites, setBlockedSites] = useStorage<string[]>(
    "blockedSites",
    []
  )
  const [site, setSite] = useState("")

  return (
    <div className="m-4 p-4 bg-white">
      <h1 className="text-2xl font-bold text-center">Hang On a Moment</h1>
      <img src={hangingSlothImage} className="w-48 my-5 mx-auto" />

      <div className="w-1/2 m-auto">
        <p>
          <h2 className="text-lg inline mr-3">Wait time</h2>
          <input
            type="number"
            min={3}
            value={waitTime}
            onChange={(e) => {
              setWaitTime(parseInt(e.target.value))
            }}
            className={inputClassNames + " mr-2"}
          />
          <span>Seconds</span>
        </p>

        <p className="text-lg my-2">
          Enter the page you want to block. Eg. twitter.com
        </p>
        <div className="w-full flex items-center">
          <input
            className={inputClassNames + " flex-auto"}
            value={site}
            onChange={(e) => {
              setSite(e.target.value)
            }}></input>
          <button
            className={buttonClassNames + " ml-2"}
            onClick={() => {
              const newBlockedSites = [...blockedSites, site]
              setBlockedSites(newBlockedSites)
              setSite("")
            }}>
            Add
          </button>
        </div>

        <div>
          <h2 className="text-lg my-2">Blocked Sites</h2>
          <ul className="list-disc list-inside">
            {blockedSites.map((site, index) => {
              return (
                <li className="mb-2 flex justify-between items-center pb-2 border-b">
                  {site}
                  <button
                    className={buttonClassNames}
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
        </div>
      </div>
    </div>
  )
}

export default Options
