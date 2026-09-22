import clsx from "clsx";
import {
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

interface Props {
  value: string;
  onChange: (_value: string) => void;
  /** Dipanggil saat user menekan Enter dan PIN sudah lengkap */
  onEnter?: () => void;
  length?: number;
  className?: string;
}

const PinInput = ({
  value,
  onChange,
  onEnter,
  length = 6,
  className,
}: Props) => {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const padded = value.padEnd(length, " ").slice(0, length);
  const digits = Array.from({ length }, (_, i) => padded[i].trim());
  const isComplete = value.replace(/\s/gu, "").length === length;

  const focus = (index: number) => {
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const update = (index: number, char: string) => {
    const next = padded.split("");
    next[index] = char || " ";
    onChange(next.join("").trimEnd());
  };

  const handleKeyDown =
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      // Enter — submit kalau lengkap
      if (e.key === "Enter" && isComplete) {
        e.preventDefault();
        onEnter?.();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();

        if (digits[index]) {
          update(index, "");
        } else {
          focus(index - 1);
        }

        return;
      }

      if (e.key === "ArrowLeft") {
        focus(index - 1);
        return;
      }

      if (e.key === "ArrowRight") {
        focus(index + 1);
        return;
      }

      // Angka → isi dan auto-advance
      if (/^\d$/u.test(e.key)) {
        e.preventDefault();
        update(index, e.key);
        focus(index + 1);
      }
    };

  const handleChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const char = e.target.value.replace(/\D/gu, "").slice(-1);

      if (!char) {
        return;
      }

      update(index, char);
      focus(index + 1);
    };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/gu, "")
      .slice(0, length);
    onChange(pasted);
    focus(pasted.length < length ? pasted.length : length - 1);
  };

  return (
    <div className={clsx("flex gap-2", className)}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste}
          className={clsx(
            "w-10 flex-1 rounded-[var(--radius-md)] border-2 p-2 text-center text-lg font-semibold",
            "bg-[var(--color-surface)] text-[var(--color-foreground)]",
            "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-out-andhivie)]",
            "border-[var(--color-accent)]",
            "hover:border-[var(--color-accent-foreground)]",
            "focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30",
            "outline-none",
          )}
        />
      ))}
    </div>
  );
};

export default PinInput;