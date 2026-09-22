import {
  RiveAvatar,
  type AvatarSize,
  type AvatarState,
} from "@razzia/web/components/avatar";
import Badge from "@razzia/web/components/ui/Badge";
import Button from "@razzia/web/components/ui/Button";
import Card from "@razzia/web/components/ui/Card";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const STATES: AvatarState[] = [
  "idle",
  "correct",
  "wrong",
  "thinking",
  "victory",
  "defeat",
];

const SIZES: AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];

const AvatarPreviewPage = () => {
  const [currentState, setCurrentState] = useState<AvatarState>("idle");
  const [currentSize, setCurrentSize] = useState<AvatarSize>("lg");
  const [currentStreak, setCurrentStreak] = useState(5);

  return (
    <div className="min-h-dvh bg-[var(--color-background)] p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* ── Header ─────────────────────────────────────── */}
        <Card>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Avatar Preview
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Halaman uji coba komponen Avatar. Kalau file{" "}
            <code className="rounded bg-black/30 px-1 text-xs">
              /andhivie-avatar.riv
            </code>{" "}
            belum ada, akan muncul placeholder.
          </p>
        </Card>

        {/* ── 1. Semua State ─────────────────────────────── */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">1</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Semua State
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {STATES.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <RiveAvatar state={s} size="lg" />
                <span className="text-xs font-semibold uppercase text-[var(--color-accent-gold)]">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 2. Semua Size ──────────────────────────────── */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">2</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Ukuran Semantik
            </h2>
          </div>
          <div className="flex flex-wrap items-end justify-center gap-6">
            {SIZES.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <RiveAvatar state="idle" size={s} />
                <span className="text-xs font-semibold uppercase text-[var(--color-muted-foreground)]">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 3. Dengan Nama (Inisial) ───────────────────── */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">3</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Inisial Pemain (placeholder)
            </h2>
          </div>
          <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            Prop <code className="rounded bg-black/30 px-1 text-xs">name</code>{" "}
            mengubah wajah placeholder jadi inisial. Untuk Rive asli, prop ini
            dipakai memilih karakter pemain.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <RiveAvatar state="idle" size="lg" name="Andi" />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                "Andi" → A
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RiveAvatar state="idle" size="lg" name="Andi Pratama" />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                "Andi Pratama" → AP
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RiveAvatar state="correct" size="lg" name="Budi" />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                Correct + Budi
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RiveAvatar state="wrong" size="lg" name="Citra" />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                Wrong + Citra
              </span>
            </div>
          </div>
        </Card>

        {/* ── 4. Dengan Streak Badge ─────────────────────── */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">4</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Streak Badge (≥ 3)
            </h2>
          </div>
          <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            Prop{" "}
            <code className="rounded bg-black/30 px-1 text-xs">streak</code>{" "}
            menampilkan badge api di pojok kiri atas kalau nilainya ≥ 3.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <RiveAvatar state="correct" size="lg" name="Andi" streak={2} />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                streak = 2 (tidak muncul)
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RiveAvatar state="correct" size="lg" name="Budi" streak={3} />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                streak = 3
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RiveAvatar state="victory" size="lg" name="Citra" streak={7} />
              <span className="text-xs text-[var(--color-muted-foreground)]">
                streak = 7
              </span>
            </div>
          </div>
        </Card>

        {/* ── 5. Playground ──────────────────────────────── */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="primary">5</Badge>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Playground
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            <RiveAvatar
              state={currentState}
              size={currentSize}
              name="Player"
              streak={currentStreak}
            />

            <div className="flex flex-wrap justify-center gap-2">
              {STATES.map((s) => (
                <Button
                  key={s}
                  variant={currentState === s ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setCurrentState(s)}
                >
                  {s}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {SIZES.map((s) => (
                <Button
                  key={s}
                  variant={currentSize === s ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setCurrentSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-muted-foreground)]">
                Streak:
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  setCurrentStreak((v) => Math.max(0, v - 1))
                }
              >
                −
              </Button>
              <span className="w-8 text-center font-bold text-[var(--color-foreground)]">
                {currentStreak}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCurrentStreak((v) => v + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dev/avatar")({
  component: AvatarPreviewPage,
});