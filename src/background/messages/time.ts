import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

// 直接使用默认的 sync storage 容易达到容量限制
const storage = new Storage()
export const timeStorage = new Storage({ area: "local" })

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // await timeStorage.clear()
  // 将原先存在 sync storage 中的数据移到 local storage 中来
  const timeStorageValues = await timeStorage.getItem("time")
  const syncStorageValues = await storage.getItem("time")
  if (!timeStorageValues && syncStorageValues) {
    await timeStorage.setItem("time", { ...(syncStorageValues as any) })
  }

  const { host } = req.body
  const previousTime = (await timeStorage.get("time")) || {}
  const hostTimes = Array.isArray(previousTime[host]) ? previousTime[host] : []
  hostTimes.push(Date.now())
  try {
    await timeStorage.set(
      "time",
      Object.assign(previousTime, { [host]: hostTimes })
    )
    res.send(0)
  } catch (e) {
    console.error(e)
    res.send(0)
  }
}

export default handler
