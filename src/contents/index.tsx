import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"
import styleText from "data-text:./style.css"
import { useEffect, useState } from "react"
import type { PlasmoGetStyle } from "plasmo"
import { toast, ToastContainer } from "react-toastify"
import toastifyStyle from "data-text:./ReactToastify.css"
import Countdown from "./countdown"
import { diffTime, formatTime, isToday } from "~utils"
import { useInterval } from "~hooks"

function shouldBlockCurrentUrl(blockedSites: string[]) {
  const blockCurrentUrl = blockedSites.some(
    (site) => window.location.href.indexOf(site) > -1
  )
  return blockCurrentUrl
}

const CustomPage = () => {
  const [shouldBlock, setShouldBlock] = useState(false)
  const [isBlocking, setIsBlocking] = useState(false)
  const [recordedTimes] = useStorage<{ [host: string]: number[] | number }>(
    "time"
  )
  const [hideButton, setHideButton] = useState(true)
  const [waitTime] = useStorage<number>("waitTime")
  const [blockedSites] = useStorage("blockedSites", [])
  const [startTime, setStartTime] = useState(null) // 这次浏览从何时开始
  const [noticeCount, setNoticeCount] = useState(0) // 提示过了几次，记录下来防止重复提示
  const [noticeInterval] = useStorage("noticeInterval")

  useInterval(() => {
    if (!shouldBlock || isBlocking) return
    if (!noticeInterval) return

    const MINUTES = noticeInterval // 每隔多少分钟进行提示
    const minutesInMs = 1000 * 60 * MINUTES
    const howManyTimes = Math.floor((Date.now() - startTime) / minutesInMs)

    if (howManyTimes > noticeCount) {
      toast(
        `You have been on this page for over ${
          howManyTimes * MINUTES
        } minutes.`,
        {
          position: toast.POSITION.TOP_RIGHT
        }
      )
      setNoticeCount(howManyTimes)
    }
  }, 1000 * 10)

  useEffect(() => {
    setShouldBlock(shouldBlockCurrentUrl(blockedSites))
  }, [blockedSites])

  useEffect(() => {
    if (shouldBlock) setIsBlocking(true)
  }, [shouldBlock])

  let timeoutId = null
  useEffect(() => {
    if (!shouldBlock) return

    clearTimeout(timeoutId)
    timeoutId = setTimeout(
      () => {
        setHideButton(false)
      },
      (waitTime || 10) * 1000
    )
  }, [waitTime, shouldBlock])

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
    setIsBlocking(false)
    setStartTime(Date.now())
  }

  const [lastTime, setLastTime] = useState(0)
  useEffect(() => {
    let lastTime = 0
    if (recordedTimes?.[location.host]) {
      if (Array.isArray(recordedTimes[location.host])) {
        lastTime = (recordedTimes[location.host] as number[]).at(-1)
      } else {
        lastTime = recordedTimes[location.host] as number
      }
    }
    setLastTime(lastTime)
  }, [recordedTimes])

  const elapsedTime = lastTime ? diffTime(Date.now() - lastTime) : null

  useEffect(() => {
    // 一分钟内不会再次阻拦同一个网站 TODO: 设置一个选项
    const isCoolingDown = lastTime ? Date.now() - lastTime < 1000 * 60 : false
    if (isCoolingDown) {
      setStartTime(Date.now())
      setIsBlocking(false)
    }
  }, [lastTime])

  // 在一个不需要屏蔽的页面上，返回 null
  if (!shouldBlock) return null

  // 在需要屏蔽的页面上，但此时选择了继续浏览
  if (!isBlocking) return <NotBlock />

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
        {document.title || "---"}
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
  style.textContent = styleText + toastifyStyle
  return style
}

const NotBlock = () => {
  return (
    <div className="hang-on__not-block">
      <ToastContainer />
    </div>
  )
}
