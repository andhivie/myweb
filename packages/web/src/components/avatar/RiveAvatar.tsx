import { useRive } from "@rive-app/react-canvas";
import clsx from "clsx";
import { useEffect, useState } from "react";

export type AvatarState =
  | "idle"
  | "correct"
  | "wrong"
  | "thinking"
  | "victory"
  | "defeat";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface Props {
  state?: AvatarState;
  size?: AvatarSize;
  name?: string;
  streak?: number;
  /** Path file .riv */
  src?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "size-10",
  sm: "size-14",
  md: "size-20",
  lg: "size-28",
  xl: "size-40",
};

const STREAK_THRESHOLD = 3;

/* ═══════════════════════════════════════════════════════════
   IKON SVG INLINE (untuk placeholder)
   ═══════════════════════════════════════════════════════════ */

const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: { width: "100%", height: "100%" },
};

const StateIcon = ({ state }: { state: AvatarState }) => {
  if (state === "correct") {
    return (
      <svg {...iconBase}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (state === "wrong") {
    return (
      <svg {...iconBase}>
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </svg>
    );
  }
  if (state === "thinking") {
    return (
      <svg {...iconBase}>
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      </svg>
    );
  }
  if (state === "victory") {
    return (
      <svg {...iconBase}>
        <path d="M5 17l-2 4h18l-2-4M7 17V9a5 5 0 0 1 10 0v8" />
        <circle cx="12" cy="6" r="1" />
      </svg>
    );
  }
  if (state === "defeat") {
    return (
      <svg {...iconBase}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 16s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01" />
      </svg>
    );
  }
  return (
    <svg {...iconBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  );
};

const FlameIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: "100%", height: "100%" }}
    aria-hidden="true"
  >
    <path d="M12 2c0 4-5 6-5 11a5 5 0 0 0 10 0c0-2-1-3-1-3s-1 2-2 2c0-3-2-5-2-10z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   WARNA PER STATE
   ═══════════════════════════════════════════════════════════ */

const STATE_STYLE: Record<
  AvatarState,
  { border: string; circleBg: string; iconColor: string }
> = {
  idle: {
    border: "border-[var(--color-accent)]",
    circleBg: "rgba(184, 169, 169, 0.15)",
    iconColor: "#b8a9a9",
  },
  correct: {
    border: "border-emerald-500/60",
    circleBg: "rgba(16, 185, 129, 0.18)",
    iconColor: "#34d399",
  },
  wrong: {
    border: "border-red-500/60",
    circleBg: "rgba(239, 68, 68, 0.18)",
    iconColor: "#f87171",
  },
  thinking: {
    border: "border-[var(--color-accent-gold)]/60",
    circleBg: "rgba(212, 168, 131, 0.18)",
    iconColor: "#d4a883",
  },
  victory: {
    border: "border-[var(--color-accent-gold)]",
    circleBg: "rgba(212, 168, 131, 0.25)",
    iconColor: "#d4a883",
  },
  defeat: {
    border: "border-[var(--color-muted-foreground)]/40",
    circleBg: "rgba(184, 169, 169, 0.12)",
    iconColor: "#b8a9a9",
  },
};

/* ═══════════════════════════════════════════════════════════
   HELPER
   ═══════════════════════════════════════════════════════════ */

const getInitials = (name?: string): string | null => {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

const StreakBadge = ({ streak }: { streak: number }) => (
  <div
    className={clsx(
      "absolute -top-1.5 -left-1.5 z-10",
      "flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
      "bg-gradient-to-br from-amber-500 to-red-500",
      "text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
    )}
    aria-label={`Streak: ${streak}`}
  >
    <span className="size-3">
      <FlameIcon />
    </span>
    <span className="text-[10px] font-bold leading-none">{streak}</span>
  </div>
);

const PulseDot = ({ state }: { state: AvatarState }) => {
  if (state === "correct") {
    return (
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>
    );
  }
  if (state === "wrong") {
    return (
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
      </span>
    );
  }
  return null;
};

/* ═══════════════════════════════════════════════════════════
   PLACEHOLDER
   ═══════════════════════════════════════════════════════════ */

const AvatarPlaceholder = ({
  state,
  sizeClass,
  name,
  streak,
}: {
  state: AvatarState;
  sizeClass: string;
  name?: string;
  streak?: number;
}) => {
  const style = STATE_STYLE[state];
  const initials = getInitials(name);
  const showStreak = typeof streak === "number" && streak >= STREAK_THRESHOLD;

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center rounded-[var(--radius-xl)]",
        "border-2 bg-[var(--color-surface)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        "transition-transform duration-300",
        style.border,
        state === "correct" && "scale-[1.03]",
        state === "wrong" && "scale-[0.97]",
        sizeClass,
      )}
      role="img"
      aria-label={`Avatar: ${state}${name ? ` — ${name}` : ""}`}
    >
      {showStreak && <StreakBadge streak={streak} />}
      <PulseDot state={state} />

      <div
        style={{
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          backgroundColor: style.circleBg,
          color: style.iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {initials ? (
          <span
            style={{
              fontWeight: 800,
              fontSize: "calc(100% * 1.1)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {initials}
          </span>
        ) : (
          <div
            style={{
              width: "55%",
              height: "55%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StateIcon state={state} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   KOMPONEN UTAMA
   ═══════════════════════════════════════════════════════════ */

export const RiveAvatar = ({
  state = "idle",
  size = "md",
  name,
  streak,
  src = "/andhivie-avatar.riv",
}: Props) => {
  const [rivAvailable, setRivAvailable] = useState<boolean | null>(null);
  const [riveError, setRiveError] = useState<boolean>(false);

  const sizeClass = SIZE_CLASSES[size];

  // PENTING: Jangan sebutkan stateMachines di sini.
  // Rive akan render karakter dengan state default-nya.
  // State machine akan kita deteksi setelah render berhasil.
  const { rive, RiveComponent } = useRive({
    src,
    autoplay: true,
    onLoadError: (err: unknown) => {
      console.error("[RiveAvatar] Rive load error:", err);
      setRiveError(true);
    },
  });

  // Cek ketersediaan file .riv
  useEffect(() => {
    let cancelled = false;

    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (cancelled) return;

        const contentType = res.headers.get("content-type") ?? "";
        const isHtml = contentType.includes("text/html");
        const exists = res.ok && !isHtml;

        if (import.meta.env.DEV) {
          console.log(
            `[RiveAvatar] ${src} → status: ${res.status}, content-type: ${contentType}, available: ${exists}`,
          );
        }

        setRivAvailable(exists);
      })
      .catch(() => {
        if (!cancelled) setRivAvailable(false);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  // Log state machine yang tersedia (untuk debugging)
  useEffect(() => {
    if (!rive) return;

    const names = rive.stateMachineNames;
    console.log("[RiveAvatar] State machines in file:", names);
    console.log("[RiveAvatar] Artboard names:", rive.contents);

    // Kalau ada state machine, mainkan yang pertama
    if (names && names.length > 0) {
      rive.play(names[0]);
    }
  }, [rive]);

  // 1. Placeholder — file .riv tidak tersedia atau Rive gagal load
  if (rivAvailable === false || riveError) {
    return (
      <AvatarPlaceholder
        state={state}
        sizeClass={sizeClass}
        name={name}
        streak={streak}
      />
    );
  }

  // 2. Skeleton
  if (rivAvailable === null) {
    return (
      <div
        className={clsx(
          "animate-pulse rounded-[var(--radius-xl)] border-2 border-[var(--color-accent)]",
          "bg-[var(--color-surface)]",
          sizeClass,
        )}
        aria-hidden="true"
      />
    );
  }

  // 3. Rive asli
  const showStreak = typeof streak === "number" && streak >= STREAK_THRESHOLD;

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center overflow-hidden rounded-[var(--radius-xl)]",
        "border border-[var(--color-accent)] bg-[var(--color-surface)]/60",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm",
        "transition-all duration-300",
        sizeClass,
      )}
      role="img"
      aria-label={`Avatar: ${state}${name ? ` — ${name}` : ""}`}
    >
      {showStreak && <StreakBadge streak={streak} />}
      <PulseDot state={state} />

      <RiveComponent className="h-full w-full object-contain" />
    </div>
  );
};

export default RiveAvatar;