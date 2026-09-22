import type {
    QuestionOptions,
    QuestionType,
    ScoringMode,
} from "@andhivie/common/types/game"
import * as multi from "@andhivie/web/features/questions/multi"
import * as single from "@andhivie/web/features/questions/single"
import type {
    AnswerComponentProps,
    SolutionPickerProps,
} from "@andhivie/web/features/questions/types"
import type { ComponentType } from "react"

interface QuestionRegistryEntry {
  labelKey: string
  defaultOptions?: QuestionOptions
  scoringModes?: ScoringMode[]
  AnswerComponent: ComponentType<AnswerComponentProps>
  ConfigComponent: ComponentType
  SolutionPicker: ComponentType<SolutionPickerProps>
}

export const QUESTION_REGISTRY: Record<QuestionType, QuestionRegistryEntry> = {
  single,
  multi,
}

export const QUESTION_TYPE_LIST = Object.keys(
  QUESTION_REGISTRY,
) as QuestionType[]
