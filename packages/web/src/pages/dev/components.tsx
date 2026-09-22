import {
  AnswerOption,
  LeaderboardItem,
  ProgressBar,
  Timer,
} from "@razzia/web/components/quiz";
import Badge from "@razzia/web/components/ui/Badge";
import Button from "@razzia/web/components/ui/Button";
import Card from "@razzia/web/components/ui/Card";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const LABELS = ["A", "B", "C", "D"] as const;
const SAMPLE_ANSWERS = [
  "Paris",
  "London",
  "Berlin",
  "Madrid",
] as const;

const ComponentsPreviewPage = () => {
  const [time, setTime] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-dvh bg-[var(--color-background)] p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Header */}
        <Card>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Quiz Components Preview
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Halaman uji coba komponen kuis Andhivie.
          </p>
        </Card>

        {/* 1. Answer Option */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">1</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Answer Option
            </h2>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {SAMPLE_ANSWERS.map((answer, i) => (
              <AnswerOption
                key={i}
                index={i as 0 | 1 | 2 | 3}
                label={LABELS[i]}
                state={selected === i ? "selected" : "default"}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                {answer}
              </AnswerOption>
            ))}
          </div>

          <div className="border-t border-[var(--color-accent)] pt-4">
            <p className="mb-3 text-xs font-semibold uppercase text-[var(--color-muted-foreground)]">
              Semua state
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AnswerOption index={0} label="A" state="correct">
                Correct answer
              </AnswerOption>
              <AnswerOption index={1} label="B" state="wrong">
                Wrong answer
              </AnswerOption>
              <AnswerOption index={2} label="C" state="dimmed">
                Dimmed (not chosen)
              </AnswerOption>
              <AnswerOption index={3} label="D" state="selected">
                Selected
              </AnswerOption>
            </div>
          </div>
        </Card>

        {/* 2. Timer */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">2</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Timer
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Timer current={30} total={30} size={100} />
            <Timer current={15} total={30} size={100} />
            <Timer current={5} total={30} size={100} />
            <Timer current={2} total={30} size={100} />
            <Timer current={45} total={60} size={64} />
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 border-t border-[var(--color-accent)] pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTime((t) => Math.max(0, t - 5))}
            >
              −5s
            </Button>
            <span className="w-12 text-center font-bold text-[var(--color-foreground)]">
              {time}s
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTime((t) => Math.min(60, t + 5))}
            >
              +5s
            </Button>
          </div>
        </Card>

        {/* 3. Progress Bar */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">3</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Progress Bar
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <ProgressBar current={1} total={10} />
            <ProgressBar current={5} total={10} />
            <ProgressBar current={7} total={8} />
          </div>
        </Card>

        {/* 4. Leaderboard Item */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">4</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Leaderboard Item
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <LeaderboardItem rank={1} name="Andi Pratama" points={1250} streak={5} />
            <LeaderboardItem rank={2} name="Budi Santoso" points={980} />
            <LeaderboardItem rank={3} name="Citra Dewi" points={870} streak={3} />
            <LeaderboardItem rank={4} name="Dian Kusuma" points={640} />
            <LeaderboardItem rank={5} name="Eka Wijaya" points={510} isMe streak={4} />
            <LeaderboardItem rank={12} name="Fajar Nugroho" points={180} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dev/components")({
  component: ComponentsPreviewPage,
});