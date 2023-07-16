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

  return (
    <div className="hold-on">
      <h2>本页面已被屏蔽</h2>
      <p>页面标题：{document.title}</p>
      <p>
        上次打开是在&nbsp;
        <span
          style={{
            fontWeight: "bold"
          }}>
          {formatTime(diffTime(Date.now() - lastTime))}
        </span>
        &nbsp;前
      </p>
      <Countdown />

      {!hideButton && (
        <button
          className="custom-btn btn-16"
          onClick={async () => {
            try {
              await sendToBackground({ name: "time" })
            } catch (e) {
              console.error(e)
            }
            setBlocked(false)
          }}>
          仍然查看
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
