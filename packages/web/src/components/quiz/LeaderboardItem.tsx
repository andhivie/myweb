import clsx from "clsx";

interface Props {
  rank: number;
  name: string;
  points: number;
  streak?: number;
  /** Tandai pemain yang sedang login */
  isMe?: boolean;
  className?: string;
}

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

const getRankStyle = (rank: number) => {
  if (rank === 1)
    return {
      bg: "linear-gradient(135deg, #facc15, #eab308)",
      color: "#1a140b",
    };
  if (rank === 2)
    return {
      bg: "linear-gradient(135deg, #e5e7eb, #9ca3af)",
      color: "#1a140b",
    };
  if (rank === 3)
    return {
      bg: "linear-gradient(135deg, #d97706, #b45309)",
      color: "#ffffff",
    };
  return {
    bg: "var(--color-muted)",
    color: "var(--color-muted-foreground)",
  };
};

const LeaderboardItem = ({
  rank,
  name,
  points,
  streak,
  isMe = false,
  className,
}: Props) => {
  const rankStyle = getRankStyle(rank);
  const showStreak = typeof streak === "number" && streak >= 3;

  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2.5",
        "transition-colors duration-200",
        isMe
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
          : "border-[var(--color-accent)] bg-[var(--color-surface)]",
        className,
      )}
    >
      {/* Rank badge */}
      <span
        className="flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] font-extrabold tabular-nums"
        style={{
          width: 32,
          height: 32,
          fontSize: 14,
          background: rankStyle.bg,
          color: rankStyle.color,
        }}
      >
        {rank}
      </span>

      {/* Name */}
      <span
        className={clsx(
          "min-w-0 flex-1 truncate font-semibold",
          isMe
            ? "text-[var(--color-foreground)]"
            : "text-[var(--color-foreground)]",
        )}
        style={{ fontSize: 15 }}
      >
        {name}
      </span>

      {/* Streak badge */}
      {showStreak && (
        <span
          className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-br from-amber-500 to-red-500 px-2 py-0.5 text-white"
          title={`${streak} correct in a row`}
        >
          <span style={{ width: 12, height: 12, display: "inline-flex" }}>
            <FlameIcon />
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, lineHeight: 1 }}>
            {streak}
          </span>
        </span>
      )}

      {/* Points */}
      <span
        className="shrink-0 font-extrabold tabular-nums text-[var(--color-accent-gold)]"
        style={{ fontSize: 16 }}
      >
        {points}
      </span>
    </div>
  );
};

export default LeaderboardItem;