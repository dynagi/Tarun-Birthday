import { useMemo } from "react";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

/* Muted festive flecks — enough to read as a birthday scrapbook page,
   quiet enough that the photograph stays the hero. */
const FLECK_COLORS = [
  "var(--color-rust)",
  "var(--color-sage)",
  "var(--color-ink-faint)",
  "#c98a4b",
];

/**
 * A warm cream album page. Sits above the site's birthday world for this
 * section only, so the memories read as printed photographs on paper.
 */
export default function ScrapbookBackdrop() {
  const flecks = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const r = ((Math.sin((i + 1) * 41.7) * 4371.3) % 1 + 1) % 1;
        const r2 = ((Math.sin((i + 5) * 91.3) * 1731.7) % 1 + 1) % 1;
        const lane = i % 4;
        const x = lane < 2 ? 1 + r * 12 : 87 + r * 12;
        const y = 4 + r2 * 92;
        return {
          id: i,
          x,
          y,
          w: 4 + r * 6,
          h: 2 + r2 * 3,
          rot: r2 * 180,
          color: FLECK_COLORS[i % FLECK_COLORS.length],
          dur: 12 + r * 8,
          delay: -r2 * 12,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-paper" aria-hidden="true">
      {/* aged paper: warmer at the edges, lighter where the light falls */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 50% 28%, #f7f1e4 0%, #efe7d8 46%, #e2d6bf 100%)",
        }}
      />

      {/* faint foxing / age blooms */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(38% 30% at 12% 16%, rgba(178,142,96,0.16) 0%, transparent 70%)," +
            "radial-gradient(34% 26% at 88% 78%, rgba(160,120,80,0.14) 0%, transparent 72%)," +
            "radial-gradient(30% 24% at 82% 12%, rgba(150,132,96,0.1) 0%, transparent 70%)",
        }}
      />

      {/* paper fibre */}
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{ backgroundImage: GRAIN, mixBlendMode: "multiply" }}
      />

      {/* muted confetti flecks, kept to the outer margins */}
      {flecks.map((f) => (
        <span
          key={f.id}
          className="bw-a absolute rounded-[1px]"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.w,
            height: f.h,
            background: f.color,
            opacity: 0.26,
            animationName: "bw-float",
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
            "--bw-dy": "-14px",
            "--bw-dx": "6px",
            "--bw-rot": `${f.rot}deg`,
          }}
        />
      ))}

      {/* soft warm vignette so the page has edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 82% 70% at 50% 46%, transparent 42%, rgba(120,92,58,0.16) 100%)",
        }}
      />
    </div>
  );
}
