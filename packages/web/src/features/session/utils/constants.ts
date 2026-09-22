import { EVENTS } from "@andhivie/common/constants"
import Answers from "@andhivie/web/features/session/components/states/Answers"
import Leaderboard from "@andhivie/web/features/session/components/states/Leaderboard"
import PlayerFinished from "@andhivie/web/features/session/components/states/PlayerFinished"
import Podium from "@andhivie/web/features/session/components/states/Podium"
import Prepared from "@andhivie/web/features/session/components/states/Prepared"
import Question from "@andhivie/web/features/session/components/states/Question"
import Responses from "@andhivie/web/features/session/components/states/Responses"
import Result from "@andhivie/web/features/session/components/states/Result"
import Room from "@andhivie/web/features/session/components/states/Room"
import Start from "@andhivie/web/features/session/components/states/Start"
import Wait from "@andhivie/web/features/session/components/states/Wait"

import { STATUS } from "@andhivie/common/types/game/status"

export const ANSWERS_COLORS = [
  "bg-[var(--color-answer-1)] text-white",
  "bg-[var(--color-answer-2)] text-white",
  "bg-[var(--color-answer-3)] text-white",
  "bg-[var(--color-answer-4)] text-white",
]

export const ANSWERS_LABELS = ["A", "B", "C", "D"]

export const GAME_STATES = {
  status: {
    name: STATUS.WAIT,
    data: { text: "Waiting for the players" },
  },
  question: {
    current: 1,
    total: null,
  },
}

export const GAME_STATE_COMPONENTS = {
  [STATUS.SELECT_ANSWER]: Answers,
  [STATUS.SHOW_QUESTION]: Question,
  [STATUS.WAIT]: Wait,
  [STATUS.SHOW_START]: Start,
  [STATUS.SHOW_RESULT]: Result,
  [STATUS.SHOW_PREPARED]: Prepared,
  [STATUS.FINISHED]: PlayerFinished,
}

export const GAME_STATE_COMPONENTS_MANAGER = {
  ...GAME_STATE_COMPONENTS,
  [STATUS.SHOW_ROOM]: Room,
  [STATUS.SHOW_RESPONSES]: Responses,
  [STATUS.SHOW_LEADERBOARD]: Leaderboard,
  [STATUS.FINISHED]: Podium,
}

export const SFX = {
  ANSWERS: {
    MUSIC: "/sounds/answersMusic.mp3",
    SOUND: "/sounds/answersSound.mp3",
  },
  PODIUM: {
    THREE: "/sounds/three.mp3",
    SECOND: "/sounds/second.mp3",
    FIRST: "/sounds/first.mp3",
    SNEAR_ROOL: "/sounds/snearRoll.mp3",
  },
  RESULTS_SOUND: "/sounds/results.mp3",
  SHOW_SOUND: "/sounds/show.mp3",
  BOUMP_SOUND: "/sounds/boump.mp3",
} as const

export const MANAGER_SKIP_EVENTS = {
  [STATUS.SHOW_ROOM]: EVENTS.MANAGER.START_GAME,
  [STATUS.SELECT_ANSWER]: EVENTS.MANAGER.ABORT_QUIZ,
  [STATUS.SHOW_RESPONSES]: EVENTS.MANAGER.SHOW_LEADERBOARD,
  [STATUS.SHOW_LEADERBOARD]: EVENTS.MANAGER.NEXT_QUESTION,
} as const satisfies Partial<
  Record<keyof typeof GAME_STATE_COMPONENTS_MANAGER, string>
>

export function isKeyOf<T extends object>(
  obj: T,
  key: string,
): key is keyof T & string {
  return key in obj
}

export const MANAGER_SKIP_BTN = {
  [STATUS.SHOW_ROOM]: "game:startGame",
  [STATUS.SHOW_START]: null,
  [STATUS.SHOW_PREPARED]: null,
  [STATUS.SHOW_QUESTION]: null,
  [STATUS.SELECT_ANSWER]: "common:skip",
  [STATUS.SHOW_RESULT]: null,
  [STATUS.SHOW_RESPONSES]: "common:next",
  [STATUS.SHOW_LEADERBOARD]: "common:next",
  [STATUS.FINISHED]: "common:exit",
  [STATUS.WAIT]: null,
}
