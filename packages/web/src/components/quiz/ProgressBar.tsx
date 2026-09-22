import clsx from "clsx";

interface Props {
  /** Nomor soal aktif (1-indexed) */
  current: number;
  /** Total soal */
  total: number;
  /** Tampilkan label "3 / 10" */
  showLabel?: boolean;
  className?: string;
}

const ProgressBar = ({
  current,
  total,
  showLabel = true,
  className,
}: Props) => {
  const safeTotal = Math.max(total, 1);
  const percent = Math.max(0, Math.min(100, (current / safeTotal) * 100));

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
          <span>Progress</span>
          <span className="tabular-nums">
            {current} / {total}
          </span>
        </div>
      )}

      <div
        className="relative w-full overflow-hidden rounded-full bg-[var(--color-muted)]"
        style={{ height: 8 }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary-hover)] to-[var(--color-primary)] transition-[width] duration-500 ease-[var(--ease-out-andhivie)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;