import { AnswerOption } from "@andhivie/web/components/quiz";
import Button from "@andhivie/web/components/ui/Button";
import type { AnswerComponentProps } from "@andhivie/web/features/questions/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LABELS = ["A", "B", "C", "D"] as const;

const MultiAnswers = ({
  answers,
  onSubmit,
  readOnly,
}: AnswerComponentProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const { t } = useTranslation();

  const handleSubmit = () => onSubmit(selected);

  const toggle = (key: number) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const canSubmit = selected.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 md:gap-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {answers.map((answer, key) => {
          const isSelected = selected.includes(key);

          return (
            <AnswerOption
              key={key}
              index={key as 0 | 1 | 2 | 3}
              label={LABELS[key]}
              state={readOnly ? "default" : isSelected ? "selected" : "default"}
              onClick={() => !readOnly && toggle(key)}
              disabled={readOnly}
              style={{
                animation: `answers-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${key * 0.07}s backwards`,
              }}
            >
              {answer}
            </AnswerOption>
          );
        })}
      </div>

      {!readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          fullWidth
          className="mx-auto mt-2 max-w-sm"
        >
          {t("game:confirm")}
          {canSubmit && (
            <span className="ml-1 rounded-full bg-black/25 px-2 py-0.5 text-xs font-bold">
              {selected.length}
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

export default MultiAnswers;