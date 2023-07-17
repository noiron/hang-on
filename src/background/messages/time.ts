import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const host = req.body.host
  const previousTime = (await storage.get("time")) || {}
  await storage.set("time", Object.assign(previousTime, { [host]: Date.now() }))
  res.send(0)
}

export default handler
