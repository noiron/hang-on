import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import "../style.css"
import "./popup.css"

function IndexPopup() {
  const [blockedSites, setBlockedSites] = useStorage<string[]>(
    "blockedSites",
    []
  )
  const [isBlocked, setIsBlocked] = useState(false)
  const [matchedSite, setMatchedSite] = useState("")
  const [currentUrl, setCurrentUrl] = useState<URL>(null)

  useEffect(() => {
    async function check() {
      if (currentUrl) return

      // 需要添加 permissions activeTab 才能获取 url
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (!tabs.length) return

      console.log("url[0] ", tabs[0])
      const firstTab = tabs[0]
      // eg. chrome://newtab/  chrome-extension://xxx
      if (!firstTab.url?.startsWith("http")) return

      setCurrentUrl(new URL(firstTab.url))
    }

    check()
  })

  useEffect(() => {
    if (!currentUrl) return

    let blocked = false
    for (let i = 0; i < blockedSites.length; i++) {
      const site = blockedSites[i]
      if (currentUrl.origin.indexOf(site) > -1) {
        setMatchedSite(site)
        blocked = true
        break
      }
    }
    setIsBlocked(blocked)
  }, [currentUrl, blockedSites])

  function handleClick() {
    if (isBlocked) {
      const index = blockedSites.indexOf(matchedSite)
      const newBlockedSites = [...blockedSites]
      newBlockedSites.splice(index, 1)
      setBlockedSites(newBlockedSites)
    } else {
      const host = currentUrl.host
      const newBlockedSites = [...blockedSites, host]
      setBlockedSites(newBlockedSites)
    }
  }

  if (!currentUrl) {
    return (
      <div
        style={{
          width: 280,
          padding: 8
        }}>
        <h2>Sorry, you can't block this page</h2>
      </div>
    )
  }

  const text = isBlocked
    ? "This site is blocked"
    : "Do you want to block this site ?"

  return (
    <div
      className="p-4"
      style={{
        width: 400
      }}>
      <div>
        <h2 className="mb-2 text-xl font-bold">{text}</h2>
        <p className="text-lg pb-2">
          {isBlocked ? matchedSite : currentUrl?.host}
        </p>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleClick}>
          {isBlocked ? "Unblock" : "Block"}
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
