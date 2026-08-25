import { useEffect, useRef } from "react";

/* Muted, warm paper stock rather than primary-colour plastic. */
const STOCK = [
  ["#ffb627", "#c98a12"],
  ["#a45c34", "#743c20"],
  ["#74855f", "#4e5b3e"],
  ["#efe7d8", "#c4b79f"],
  ["#c96f5a", "#964b39"],
  ["#d9cbaa", "#ad9f7e"],
  ["#e0a458", "#a8763a"],
  ["#8098a6", "#5a6d78"],
];

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);

function makePiece(x, y, angle, speed) {
  const [color, shade] = STOCK[(Math.random() * STOCK.length) | 0];
  const strip = Math.random() < 0.35;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    w: strip ? rand(3.5, 6) : rand(6, 11),
    h: strip ? rand(11, 17) : rand(6, 11),
    rot: Math.random() * TAU,
    rotV: rand(-0.22, 0.22),
    tilt: Math.random() * TAU,
    tiltV: rand(0.09, 0.2),
    g: rand(0.26, 0.4),
    drag: rand(0.976, 0.99),
    alpha: 1,
    color,
    shade,
  };
}

function makeDrifter(w) {
  const p = makePiece(rand(0, w), -20, Math.PI / 2, rand(0.6, 1.4));
  p.g = rand(0.03, 0.07);
  p.drag = 0.995;
  p.alpha = rand(0.45, 0.8);
  p.tiltV = rand(0.05, 0.11);
  return p;
}

/**
 * Canvas party-popper. `fire` triggers one burst; `drift` keeps a few pieces
 * falling gently afterwards. The loop parks itself whenever nothing is moving.
 */
export default function PaperConfetti({ fire = false, drift = false, originY = 0.44 }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const api = useRef({ burst: null, start: null });
  const driftRef = useRef(drift);

  useEffect(() => {
    driftRef.current = drift;
  }, [drift]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let pieces = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let driftAcc = 0;

    function resize() {
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    function step(now) {
      const dt = Math.min((now - last) / 16.667, 2.5);
      last = now;
      ctx.clearRect(0, 0, width, height);

      if (driftRef.current && !reduce && pieces.length < 22) {
        driftAcc += dt;
        if (driftAcc > 26) {
          driftAcc = 0;
          pieces.push(makeDrifter(width));
        }
      }

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        const d = Math.pow(p.drag, dt);
        p.vy = p.vy * d + p.g * dt;
        p.vx *= d;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.rotV * dt;
        p.tilt += p.tiltV * dt;

        if (p.y > height + 50 || p.x < -80 || p.x > width + 80) {
          pieces.splice(i, 1);
          continue;
        }

        const flutter = Math.cos(p.tilt);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.max(0.12, Math.abs(flutter)));
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = flutter < 0 ? p.shade : p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (pieces.length === 0 && !driftRef.current) {
        running = false;
        ctx.clearRect(0, 0, width, height);
        return;
      }
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    }

    api.current.start = start;
    api.current.burst = () => {
      if (!width || !height) resize();
      const cy = height * originY;
      // Three muzzles: one behind the text, two flanking it like poppers.
      const spread = Math.min(width * 0.28, 210);
      const muzzles = [
        { x: width / 2, y: cy, from: -Math.PI * 0.86, to: -Math.PI * 0.14, n: 0.46 },
        { x: width / 2 - spread, y: cy + 18, from: -Math.PI * 0.72, to: -Math.PI * 0.24, n: 0.27 },
        { x: width / 2 + spread, y: cy + 18, from: -Math.PI * 0.76, to: -Math.PI * 0.28, n: 0.27 },
      ];
      const total = reduce ? 26 : 104;

      muzzles.forEach((m, mi) => {
        const count = Math.round(total * m.n);
        for (let i = 0; i < count; i++) {
          const angle = rand(m.from, m.to);
          // pow<1 biases toward the fast end so a few pieces fly much farther
          const speed = 3.2 + Math.pow(Math.random(), 0.55) * 12;
          const p = makePiece(
            m.x + rand(-34, 34),
            m.y + rand(-16, 16),
            angle,
            speed
          );
          if (mi === 1) p.vx += 1.6;
          if (mi === 2) p.vx -= 1.6;
          pieces.push(p);
        }
      });
      start();
    };

    if (driftRef.current) start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      pieces = [];
    };
  }, [originY]);

  useEffect(() => {
    if (fire) api.current.burst?.();
  }, [fire]);

  useEffect(() => {
    if (drift) api.current.start?.();
  }, [drift]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
