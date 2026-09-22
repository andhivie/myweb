import type { Server } from "@andhivie/common/types/game/socket"
import { gameSocketHandlers } from "@andhivie/socket/handlers/game"
import { managerSocketHandlers } from "@andhivie/socket/handlers/manager"
import { quizzSocketHandlers } from "@andhivie/socket/handlers/quizz"
import { resultsSocketHandlers } from "@andhivie/socket/handlers/results"
import type { SocketHandler } from "@andhivie/socket/handlers/types"
import { initConfig } from "@andhivie/socket/services/config"
import Registry from "@andhivie/socket/services/registry"
import { Server as ServerIO } from "socket.io"

const WS_PORT = 3001

const io: Server = new ServerIO({
  path: "/ws",
})
initConfig()

console.log(`Socket server running on port ${WS_PORT}`)
io.listen(WS_PORT)

const socketHandlers: SocketHandler[] = [
  managerSocketHandlers,
  quizzSocketHandlers,
  gameSocketHandlers,
  resultsSocketHandlers,
]

io.on("connection", (socket) => {
  console.log(
    `A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`,
  )

  socketHandlers.forEach((handler) => {
    handler({ io, socket })
  })
})

process.on("SIGINT", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})

process.on("SIGTERM", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})
