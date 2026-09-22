import { EVENTS } from "@andhivie/common/constants"
import ManagerPassword from "@andhivie/web/features/manager/components/ManagerPassword"
import {
    useEvent,
    useSocket,
} from "@andhivie/web/features/session/contexts/socket-context"
import { useManagerStore } from "@andhivie/web/features/session/stores/manager"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

const ManagerAuthPage = () => {
  const { setConfig } = useManagerStore()
  const navigate = useNavigate()
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!isConnected) {
      return
    }

    socket.emit(EVENTS.MANAGER.GET_CONFIG)
    // oxlint-disable-next-line
  }, [isConnected])

  useEvent(EVENTS.MANAGER.CONFIG, (data) => {
    setConfig(data)
    navigate({ to: "/manager/config" })
  })

  const handleAuth = (password: string) => {
    socket.emit(EVENTS.MANAGER.AUTH, password)
  }

  return <ManagerPassword onSubmit={handleAuth} />
}

export const Route = createFileRoute("/(auth)/manager/")({
  component: ManagerAuthPage,
})
