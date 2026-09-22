import { QUESTION_TYPES } from "@andhivie/common/constants"
import type { Question } from "@andhivie/common/types/game"
import type { ScoringFn } from "@andhivie/socket/services/scoring"

export const type = QUESTION_TYPES.SINGLE

export const scoring: ScoringFn = (
  question: Question,
  answerIds: number[],
): number =>
  answerIds.length === 1 && question.solutions.includes(answerIds[0]) ? 1 : 0
