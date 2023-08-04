import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import sloth from "data-base64:~assets/sloth.svg"
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

  function toggleBlock() {
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
      <div className="p-4 w-[350px]">
        <h2 className="text-lg">
          Sorry, you can't block this page
          <img src={sloth} className="w-6 ml-2 inline" />
        </h2>
      </div>
    )
  }

  const text = isBlocked
    ? "This site is blocked"
    : "Do you want to block this site ?"

  return (
    <div className="p-4 w-[340px]">
      <div>
        <h2 className="mb-2 text-xl font-bold">{text}</h2>
        <p className="text-lg">{isBlocked ? matchedSite : currentUrl?.host}</p>
        <button
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={toggleBlock}>
          {isBlocked ? "Unblock" : "Block"}
        </button>

        <button
          className="mt-2 text-blue-600 hover:underline block"
          onClick={() => {
            chrome.tabs.create({
              url: "./options.html"
            })
          }}>
          Open Options
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
