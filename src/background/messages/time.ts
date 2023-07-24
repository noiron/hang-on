import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { host } = req.body
  const previousTime = (await storage.get("time")) || {}
  const hostTimes = Array.isArray(previousTime[host]) ? previousTime[host] : []
  hostTimes.push(Date.now())
  await storage.set("time", Object.assign(previousTime, { [host]: hostTimes }))
  res.send(0)
}

export default handler
