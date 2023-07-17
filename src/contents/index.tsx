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
  const [lastTime] = useStorage<number>("time")
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

  const timeSpan = lastTime?.[location.host]
    ? diffTime(Date.now() - lastTime[location.host])
    : null

  return (
    <div className="hold-on">
      <h2>This page is blocked</h2>
      <p>Page Title: {document.title}</p>
      {timeSpan && (
        <p>
          The last time{" "}
          <span style={{ textDecoration: "underline" }}>{location.host}</span>{" "}
          opened was&nbsp;
          <span
            style={{
              fontWeight: "bold"
            }}>
            {formatTime(timeSpan)}
          </span>
          &nbsp; ago
        </p>
      )}
      <Countdown />

      {!hideButton && (
        <button
          className="custom-btn btn-16"
          onClick={async () => {
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
          }}>
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
