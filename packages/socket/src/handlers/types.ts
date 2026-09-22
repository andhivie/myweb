import type { Server, Socket } from "@andhivie/common/types/game/socket"

export interface SocketContext {
  io: Server
  socket: Socket
}

export type SocketHandler = (_context: SocketContext) => void
