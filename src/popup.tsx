import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"

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
  console.log("currentUrl: ", currentUrl)

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

  return (
    <div
      style={{
        width: 280,
        padding: 8
      }}>
      {isBlocked ? (
        <div>
          <h2>This site is blocked</h2>
          <p style={{ fontSize: 18 }}>{matchedSite}</p>
          <button
            onClick={() => {
              const index = blockedSites.indexOf(matchedSite)
              const newBlockedSites = [...blockedSites]
              newBlockedSites.splice(index, 1)
              setBlockedSites(newBlockedSites)
            }}>
            Remove
          </button>
        </div>
      ) : (
        <div>
          <h2>Do you want to block this site ?</h2>
          <p style={{ fontSize: 18 }}>{currentUrl?.host}</p>
          <button
            onClick={() => {
              const host = currentUrl.host
              const newBlockedSites = [...blockedSites, host]
              setBlockedSites(newBlockedSites)
            }}>
            Block
          </button>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
