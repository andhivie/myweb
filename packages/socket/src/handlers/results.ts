import { EVENTS } from "@andhivie/common/constants"
import type { SocketContext } from "@andhivie/socket/handlers/types"
import { deleteResult, getResultById } from "@andhivie/socket/services/config"
import manager, { emitConfig } from "@andhivie/socket/services/manager"

export const resultsSocketHandlers = ({ socket }: SocketContext) => {
  socket.on(
    EVENTS.RESULTS.GET,
    manager.withAuth(socket, (id) => {
      try {
        socket.emit(EVENTS.RESULTS.DATA, getResultById(id))
      } catch (error) {
        console.error("Failed to get result:", error)
      }
    }),
  )

  socket.on(
    EVENTS.RESULTS.DELETE,
    manager.withAuth(socket, (id) => {
      try {
        deleteResult(id)
        emitConfig(socket)
      } catch (error) {
        console.error("Failed to delete result:", error)
      }
    }),
  )
}
