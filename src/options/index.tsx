import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"
import hangingSlothImage from "data-base64:~assets/hanging-sloth.png"
import "../style.css"
import Input from "./input"
import Button from "./button"

const Options = () => {
  const [waitTime, setWaitTime] = useStorage<number>("waitTime", 10)
  const [blockedSites, setBlockedSites] = useStorage<string[]>(
    "blockedSites",
    []
  )
  const [site, setSite] = useState("")
  const [noticeInterval, setNoticeInterval] = useStorage<number>(
    "noticeInterval",
    0
  )

  return (
    <div className="m-4 p-4 bg-white">
      <h1 className="text-2xl font-bold text-center">Hang On a Moment</h1>
      <img src={hangingSlothImage} className="w-48 my-5 mx-auto" />

      <div className="w-1/2 m-auto">
        <p>
          <h2 className="text-lg inline mr-3">Wait time</h2>
          <Input
            type="number"
            min={3}
            value={waitTime}
            className="mr-2"
            onChange={(value: string) => {
              setWaitTime(parseInt(value))
            }}
          />
          <span>Seconds</span>
        </p>

        <p className="text-lg my-2">
          Enter the page you want to block. Eg. twitter.com
        </p>
        <div className="w-full flex items-center pr-2">
          <Input
            value={site}
            onChange={(value: string) => setSite(value)}
            className="flex-auto"
          />

          <Button
            handleClick={() => {
              const newBlockedSites = [...blockedSites, site]
              setBlockedSites(newBlockedSites)
              setSite("")
            }}
            className="ml-2">
            Add
          </Button>
        </div>

        <div>
          <h2 className="text-lg my-2">Blocked Sites</h2>
          <ul className="list-disc list-inside">
            {blockedSites.map((site, index) => {
              return (
                <li
                  className="flex justify-between items-center py-2 px-2
                hover:bg-slate-100 rounded border-b border-slate-200">
                  {site}
                  <Button
                    handleClick={() => {
                      const newBlockedSites = [...blockedSites]
                      newBlockedSites.splice(index, 1)
                      setBlockedSites(newBlockedSites)
                    }}>
                    Remove
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="mt-4">
          <span className="text-lg inline mr-2">Notice every </span>
          <Input
            type="number"
            min={0}
            value={noticeInterval}
            className="mr-2"
            onChange={(value: string) => {
              setNoticeInterval(parseInt(value))
            }}
          />
          <span className="text-lg inline">minutes</span>
        </p>
      </div>
    </div>
  )
}

export default Options
