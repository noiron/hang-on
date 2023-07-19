import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"
import styleText from "data-text:./style.css"
import { useEffect, useState } from "react"
import type { PlasmoGetStyle } from "plasmo"

import Countdown from "~components/countdown"
import { diffTime, formatTime } from "~utils"

function shouldBlock(blockedSites: string[]) {
  const blockCurrentUrl = blockedSites.some(
    (site) => window.location.href.indexOf(site) > -1
  )
  return blockCurrentUrl
}

const CustomPage = () => {
  const [blocked, setBlocked] = useState(false)
  const [recordedTimes] = useStorage<number>("time")
  const [hideButton, setHideButton] = useState(true)
  const [waitTime] = useStorage<number>("waitTime")
  const [blockedSites] = useStorage("blockedSites", [])

  useEffect(() => {
    setBlocked(shouldBlock(blockedSites))
  }, [blockedSites])

  let timeoutId = null
  useEffect(() => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(
      () => {
        setHideButton(false)
      },
      (waitTime || 10) * 1000
    )
  }, [waitTime])

  if (!blocked) return null

  const openAndRecord = async () => {
    try {
      await sendToBackground({
        name: "time",
        body: {
          host: window.location.host
        }
      })
    } catch (e) {
      console.error(e)
    }
    setBlocked(false)
  }

  let lastTime = 0
  if (recordedTimes?.[location.host]) {
    if (Array.isArray(recordedTimes[location.host])) {
      lastTime = recordedTimes[location.host].at(-1)
    } else {
      lastTime = recordedTimes[location.host]
    }
  }
  const elapsedTime = lastTime ? diffTime(Date.now() - lastTime) : null

  return (
    <div className="hang-on">
      <h2>This page is blocked</h2>
      <p>Page Title: {document.title}</p>
      {elapsedTime && (
        <>
          <p>
            The last time{" "}
            <span style={{ textDecoration: "underline" }}>{location.host}</span>{" "}
            opened was&nbsp;
            <span
              style={{
                fontWeight: "bold"
              }}>
              {formatTime(elapsedTime)}
            </span>
            &nbsp; ago
          </p>
          {Array.isArray(recordedTimes[location.host]) && (
            <p>你最近打开了 {recordedTimes[location.host].length} 次</p>
          )}
        </>
      )}
      <Countdown />

      {!hideButton && (
        <button className="custom-btn btn-16" onClick={openAndRecord}>
          Continue
        </button>
      )}
    </div>
  )
}

export default CustomPage

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}
