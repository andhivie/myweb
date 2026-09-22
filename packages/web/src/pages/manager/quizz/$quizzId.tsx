import { EVENTS } from "@andhivie/common/constants"
import type { QuizzWithId } from "@andhivie/common/types/game"
import Loader from "@andhivie/web/components/ui/Loader"
import QuestionEditor from "@andhivie/web/features/quizz/components/QuestionEditor"
import QuizzEditorHeader from "@andhivie/web/features/quizz/components/QuizzEditorHeader"
import QuizzEditorSidebar from "@andhivie/web/features/quizz/components/QuizzEditorSidebar"
import { QuizzEditorProvider } from "@andhivie/web/features/quizz/contexts/quizz-editor-context"
import {
    useEvent,
    useSocket,
} from "@andhivie/web/features/session/contexts/socket-context"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

const QuizzEditPage = () => {
  const { quizzId } = Route.useParams()
  const { socket } = useSocket()
  const [quizz, setQuizz] = useState<QuizzWithId | null>(null)

  useEffect(() => {
    socket.emit(EVENTS.QUIZZ.GET, quizzId)
  }, [socket, quizzId])

  useEvent(EVENTS.QUIZZ.DATA, (data) => {
    if (data.id === quizzId) {
      setQuizz(data)
    }
  })

  if (!quizz) {
    return (
      <div className="bg-muted flex h-svh items-center justify-center">
        <Loader className="text-background max-h-23" />
      </div>
    )
  }

  return (
    <QuizzEditorProvider initialData={quizz}>
      <div className="bg-muted relative flex h-svh flex-col">
        <QuizzEditorHeader />
        <div className="flex flex-1 overflow-hidden">
          <QuizzEditorSidebar />
          <QuestionEditor />
        </div>
      </div>
    </QuizzEditorProvider>
  )
}

export const Route = createFileRoute("/manager/quizz/$quizzId")({
  component: QuizzEditPage,
})
