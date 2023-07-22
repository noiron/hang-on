import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"
import styleText from "data-text:./style.css"
import { useEffect, useState } from "react"
import type { PlasmoGetStyle } from "plasmo"

import Countdown from "~components/countdown"
import { diffTime, formatTime, isToday } from "~utils"

function shouldBlockCurrentUrl(blockedSites: string[]) {
  const blockCurrentUrl = blockedSites.some(
    (site) => window.location.href.indexOf(site) > -1
  )
  return blockCurrentUrl
}

const CustomPage = () => {
  const [blocked, setBlocked] = useState(false)
  const [recordedTimes] = useStorage<{ [host: string]: number[] | number }>(
    "time"
  )
  const [hideButton, setHideButton] = useState(true)
  const [waitTime] = useStorage<number>("waitTime")
  const [blockedSites] = useStorage("blockedSites", [])

  useEffect(() => {
    setBlocked(shouldBlockCurrentUrl(blockedSites))
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
      lastTime = (recordedTimes[location.host] as number[]).at(-1)
    } else {
      lastTime = recordedTimes[location.host] as number
    }
  }
  const elapsedTime = lastTime ? diffTime(Date.now() - lastTime) : null
  // 一分钟内不会再次阻拦同一个网站 
  // TODO: 设置一个选项
  const isCoolingDown = lastTime ? Date.now() - lastTime < 1000 * 60 : false;

  if (isCoolingDown) return null

  return (
    <div className="hang-on">
      <h2>This page is blocked</h2>
      <p
        style={{
          padding: "0 30px",
          // @ts-ignore
          textWrap: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
        Page Title: {document.title}
      </p>
      {elapsedTime && (
        <>
          <p>
            The last time{" "}
            <span style={{ textDecoration: "underline" }}>{location.host}</span>{" "}
            opened was&nbsp;
            <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
              {formatTime(elapsedTime)}
            </span>
            &nbsp; ago
          </p>
          {Array.isArray(recordedTimes[location.host]) && (
            <p>
              You have opened it&nbsp;
              <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                {
                  (recordedTimes[location.host] as number[]).filter((ts) =>
                    isToday(ts)
                  ).length
                }
              </span>
              &nbsp;times today
            </p>
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
