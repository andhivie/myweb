import clsx from "clsx";

interface Props {
  /** Sisa waktu (detik) */
  current: number;
  /** Total waktu (detik) */
  total: number;
  /** Diameter dalam pixel */
  size?: number;
  /** Tampilkan angka di tengah */
  showNumber?: boolean;
  className?: string;
}

const Timer = ({
  current,
  total,
  size = 80,
  showNumber = true,
  className,
}: Props) => {
  const safeTotal = Math.max(total, 1);
  const progress = Math.max(0, Math.min(1, current / safeTotal));

  const strokeWidth = Math.max(4, Math.round(size * 0.08));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Warna berubah kalau waktu hampir habis
  const color = (() => {
    if (progress <= 0.2) return "#ef4444"; // merah
    if (progress <= 0.5) return "var(--color-accent-gold)";
    return "var(--color-primary)";
  })();

  const isLowTime = progress <= 0.2;

  return (
    <div
      className={clsx("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="timer"
      aria-label={`${current} of ${total} seconds remaining`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          opacity={0.35}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 300ms linear, stroke 300ms ease",
          }}
        />
      </svg>

      {showNumber && (
        <span
          className={clsx(
            "absolute font-extrabold tabular-nums",
            isLowTime && "animate-pulse",
          )}
          style={{
            fontSize: Math.round(size * 0.34),
            color: isLowTime ? "#ef4444" : "var(--color-foreground)",
            lineHeight: 1,
          }}
        >
          {current}
        </span>
      )}
    </div>
  );
};

export default Timer;