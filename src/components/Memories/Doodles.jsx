/*
 * Hand-drawn scrapbook marks. Deliberately limited to the set in the brief —
 * a star over the heading, a heart-and-rules divider, a heart under the
 * photograph, and leaves beside the closing line. Nothing else, and nothing
 * over the print itself.
 */

const pen = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** Four-point star, slightly uneven so it reads as drawn by hand. */
export function StarMark({ className = "", size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" style={{ width: size, height: size }} className={className} aria-hidden="true">
      <path d="M16 3.5 C17.4 12.2 19.8 14.6 28.4 16 C19.8 17.5 17.5 19.9 16 28.4 C14.6 19.9 12.1 17.6 3.6 16 C12.2 14.5 14.5 12.1 16 3.5 Z" {...pen} />
    </svg>
  );
}

/** Small open heart. */
export function HeartMark({ className = "", size = 18, filled = false }) {
  return (
    <svg viewBox="0 0 32 32" style={{ width: size, height: size }} className={className} aria-hidden="true">
      <path
        d="M16 26.6 C6.4 19.8 4.2 15.2 6.6 11.4 C9 7.9 13.4 8.6 16 12.2 C18.6 8.6 23 7.9 25.4 11.4 C27.8 15.2 25.6 19.8 16 26.6 Z"
        {...pen}
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

/** A heart flanked by two hairlines — used as a section divider. */
export function HeartRule({ className = "", width = 150 }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px bg-current opacity-40" style={{ width: width / 2 }} />
      <HeartMark size={15} />
      <span className="h-px bg-current opacity-40" style={{ width: width / 2 }} />
    </div>
  );
}

/** A leafy sprig; mirrored with `flip` for the opposite side of a line. */
export function LeafMark({ className = "", size = 34, flip = false }) {
  return (
    <svg
      viewBox="0 0 40 24"
      style={{ width: size, height: size * 0.6, transform: flip ? "scaleX(-1)" : undefined }}
      className={className}
      aria-hidden="true"
    >
      <path d="M2 20 C12 20 24 15 36 4" {...pen} />
      <path d="M10 18.5 C11 14 14 11.5 18 11 C17.5 15.5 14.5 18 10 18.5 Z" {...pen} />
      <path d="M19 14 C20 9.6 23 7 27 6.6 C26.5 11 23.5 13.6 19 14 Z" {...pen} />
      <path d="M27.5 9.5 C28.4 6.2 30.6 4.2 33.6 3.9 C33.2 7.2 31 9.2 27.5 9.5 Z" {...pen} />
    </svg>
  );
}
