import { SCORING_MODES } from "@andhivie/common/constants"
import type {
    MultiQuestionOptions,
    ScoringMode,
} from "@andhivie/common/types/game"

export { default as AnswerComponent } from "@andhivie/web/features/questions/multi/components/MultiAnswers"

export { default as ConfigComponent } from "@andhivie/web/features/questions/multi/components/MultiConfig"

export { default as SolutionPicker } from "@andhivie/web/features/questions/multi/components/MultiPicker"

export const labelKey = "quizz:questionType.multi"

export const defaultOptions: MultiQuestionOptions = {
  scoringMode: SCORING_MODES.BALANCED,
}

export const scoringModes: ScoringMode[] = [
  SCORING_MODES.STRICT,
  SCORING_MODES.BALANCED,
  SCORING_MODES.LENIENT,
]
