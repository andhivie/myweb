import type { Socket } from "@andhivie/common/types/game/socket"

export const getClientId = (socket: Socket): string =>
  socket.handshake.auth.clientId as string
