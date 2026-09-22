import type { GameResultMeta, QuizzMeta } from "@andhivie/common/types/game"

export interface ManagerConfig {
  quizz: QuizzMeta[]
  results: GameResultMeta[]
}
