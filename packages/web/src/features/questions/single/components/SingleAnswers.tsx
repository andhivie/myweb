import { AnswerOption } from "@andhivie/web/components/quiz";
import type { AnswerComponentProps } from "@andhivie/web/features/questions/types";
import clsx from "clsx";

const LABELS = ["A", "B", "C", "D"] as const;

const SingleAnswers = ({
  answers,
  onSubmit,
  readOnly,
}: AnswerComponentProps) => {
  const handleSubmit = (key: number) => onSubmit([key]);

  return (
    <div
      className={clsx(
        "mx-auto grid w-full max-w-7xl gap-3 px-3 md:gap-4",
        answers.length === 2 && "grid-cols-1 md:grid-cols-2",
        answers.length === 3 && "grid-cols-1 md:grid-cols-3",
        answers.length === 4 && "grid-cols-1 md:grid-cols-2",
      )}
    >
      {answers.map((answer, key) => (
        <AnswerOption
          key={key}
          index={key as 0 | 1 | 2 | 3}
          label={LABELS[key]}
          onClick={() => handleSubmit(key)}
          disabled={readOnly}
          style={{
            animation: `answers-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${key * 0.07}s backwards`,
          }}
        >
          {answer}
        </AnswerOption>
      ))}
    </div>
  );
};

export default SingleAnswers;