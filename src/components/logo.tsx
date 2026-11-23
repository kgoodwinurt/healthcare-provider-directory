type Props = { className?: string; markColor?: string; wordColor?: string };

/**
 * Rula wordmark + "listening arc" mark, drawn as vector so it scales
 * from a 24px favicon slot to a footer lockup without loss.
 */
export function Logo({
  className = "h-8",
  markColor = "var(--color-jacarta)",
  wordColor = "var(--color-ink)",
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="Rula">
      <svg
        viewBox="0 0 32 32"
        className="h-full w-auto shrink-0"
        role="presentation"
        aria-hidden="true"
      >
        <path
          d="M16 2.6c7.4 0 13.4 6 13.4 13.4S23.4 29.4 16 29.4 2.6 23.4 2.6 16 8.6 2.6 16 2.6Z"
          fill={markColor}
        />
        {/* two arcs reading as an open, listening "r" */}
        <path
          d="M10.6 21.4c0-6.2 2.5-10.8 6.6-10.8 2.5 0 4.1 1.7 4.1 4.2 0 2.4-1.5 4-3.7 4-1.9 0-3.1-1.2-3.1-2.9"
          fill="none"
          stroke="#FAF7F2"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="21.7" cy="21.3" r="2.5" fill="#FAF7F2" />
      </svg>
      <span
        className="font-display text-[1.6em] font-extrabold leading-none tracking-[-0.055em]"
        style={{ color: wordColor }}
      >
        rula
      </span>
    </span>
  );
}
