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
      const url = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (!url.length) return

      if (url[0]) setCurrentUrl(new URL(url[0].url))
    }

    check()
  })

  useEffect(() => {
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

  return (
    <div
      style={{
        width: 200,
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
