/*
 * PLACEHOLDER MEMORIES — temporary stand-ins so the reveal animation can be
 * judged before the real photos exist.
 *
 * To swap in the real thing later, replace the `memories` array below with:
 *
 *   import photo1 from "../../assets/photo1.jpg";
 *   export const memories = [
 *     { image: photo1, caption: "" },
 *     ...
 *   ];
 *
 * Nothing else in the memory components reads from this file, so the array
 * shape ({ image, caption }) is the only contract that has to hold.
 */

const svg = (body) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'>${body}</svg>`
  )}`;

/** A stylised "photo": graded sky, a light source, and layered silhouettes. */
const scene = ({ sky, glow, glowAt = [400, 420], glowR = 130, layers, haze = 0.14 }) =>
  svg(
    `<defs>
      <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
        ${sky
          .map(
            (c, i) =>
              `<stop offset='${((i / (sky.length - 1)) * 100).toFixed(0)}%' stop-color='${c}'/>`
          )
          .join("")}
      </linearGradient>
      <radialGradient id='glow' cx='50%' cy='50%' r='50%'>
        <stop offset='0%' stop-color='${glow}' stop-opacity='0.95'/>
        <stop offset='100%' stop-color='${glow}' stop-opacity='0'/>
      </radialGradient>
    </defs>
    <rect width='800' height='1000' fill='url(#sky)'/>
    <circle cx='${glowAt[0]}' cy='${glowAt[1]}' r='${glowR * 2.4}' fill='url(#glow)'/>
    <circle cx='${glowAt[0]}' cy='${glowAt[1]}' r='${glowR * 0.42}' fill='${glow}' opacity='0.85'/>
    ${layers.map((l) => `<path d='${l.d}' fill='${l.c}' opacity='${l.o ?? 1}'/>`).join("")}
    <rect width='800' height='1000' fill='#0d0710' opacity='${haze}'/>`
  );

const memory01 = scene({
  sky: ["#2b1c46", "#7b3f63", "#d97a5c", "#f2b483"],
  glow: "#ffd9a0",
  glowAt: [300, 560],
  glowR: 120,
  layers: [
    { d: "M0 620 Q200 540 400 606 T800 578 V1000 H0 Z", c: "#5a2f4d", o: 0.85 },
    { d: "M0 720 Q240 646 470 716 T800 690 V1000 H0 Z", c: "#361b34" },
    { d: "M0 860 Q220 812 430 858 T800 830 V1000 H0 Z", c: "#1d0f20" },
  ],
});

const memory02 = scene({
  sky: ["#050914", "#0e1b33", "#1f3557", "#3d5a7d"],
  glow: "#bcd8ff",
  glowAt: [560, 260],
  glowR: 74,
  layers: [
    { d: "M0 700 H70 V600 H130 V690 H210 V520 H280 V700 H360 V620 H430 V700 H520 V560 H590 V700 H670 V640 H740 V700 H800 V1000 H0 Z", c: "#0a1120" },
    { d: "M0 820 H90 V760 H160 V820 H250 V700 H320 V820 H420 V770 H500 V820 H600 V740 H690 V820 H800 V1000 H0 Z", c: "#050a14" },
  ],
  haze: 0.08,
});

const memory03 = scene({
  sky: ["#0b3a4a", "#1d6f80", "#5fb3ac", "#cfe9d8"],
  glow: "#fff2c4",
  glowAt: [470, 330],
  glowR: 96,
  layers: [
    { d: "M0 660 H800 V1000 H0 Z", c: "#2f8a92", o: 0.55 },
    { d: "M0 700 Q200 676 400 702 T800 682 V1000 H0 Z", c: "#1b5f6c", o: 0.8 },
    { d: "M0 880 Q260 840 520 884 T800 858 V1000 H0 Z", c: "#e2d3ae" },
  ],
  haze: 0.1,
});

const memory04 = scene({
  sky: ["#101f16", "#20402a", "#3f6b3f", "#8fae6c"],
  glow: "#e7f3b8",
  glowAt: [330, 300],
  glowR: 82,
  layers: [
    { d: "M40 1000 L110 470 L180 1000 Z M200 1000 L268 540 L336 1000 Z M360 1000 L430 440 L500 1000 Z M520 1000 L586 560 L652 1000 Z M660 1000 L726 500 L792 1000 Z", c: "#16301c" },
    { d: "M0 900 Q200 866 400 902 T800 880 V1000 H0 Z", c: "#0b1a10" },
  ],
});

const memory05 = scene({
  sky: ["#241335", "#4a2b56", "#9a5b63", "#e8a882"],
  glow: "#ffe0b3",
  glowAt: [520, 470],
  glowR: 110,
  layers: [
    { d: "M0 660 L180 430 L330 640 L470 380 L640 660 L800 500 V1000 H0 Z", c: "#4a2f52", o: 0.9 },
    { d: "M0 760 L160 590 L320 770 L500 570 L680 780 L800 690 V1000 H0 Z", c: "#2a1730" },
    { d: "M0 900 Q240 856 480 900 T800 876 V1000 H0 Z", c: "#150b1a" },
  ],
});

const memory06 = scene({
  sky: ["#3a1f16", "#7a4321", "#c68440", "#f0c583"],
  glow: "#fff0c2",
  glowAt: [270, 380],
  glowR: 104,
  layers: [
    { d: "M0 700 Q180 620 380 700 T800 660 V1000 H0 Z", c: "#a9682f", o: 0.85 },
    { d: "M0 800 Q220 726 460 806 T800 762 V1000 H0 Z", c: "#7c4620" },
    { d: "M0 900 Q240 848 500 906 T800 866 V1000 H0 Z", c: "#4a2712" },
  ],
});

const memory07 = scene({
  sky: ["#08131f", "#123049", "#2f6b7d", "#7fb0a8"],
  glow: "#f6e6bb",
  glowAt: [400, 300],
  glowR: 88,
  layers: [
    { d: "M0 520 L220 350 L400 520 L560 380 L800 540 V620 H0 Z", c: "#123245" },
    { d: "M0 620 H800 V1000 H0 Z", c: "#0d2436", o: 0.9 },
    { d: "M0 640 L220 800 L400 640 L560 790 L800 650 V700 H0 Z", c: "#1b4359", o: 0.55 },
  ],
  haze: 0.1,
});

const memory08 = scene({
  sky: ["#1a0f2c", "#33204d", "#6b3f6e", "#b06f7a"],
  glow: "#ffd7dd",
  glowAt: [600, 240],
  glowR: 70,
  layers: [
    { d: "M0 740 Q200 700 400 744 T800 716 V1000 H0 Z", c: "#2a1740" },
    { d: "M0 850 Q240 812 480 856 T800 826 V1000 H0 Z", c: "#170c26" },
    { d: "M120 210 h6 v6 h-6 Z M300 150 h5 v5 h-5 Z M480 320 h6 v6 h-6 Z M690 420 h5 v5 h-5 Z M210 400 h5 v5 h-5 Z M540 120 h6 v6 h-6 Z", c: "#ffeef1", o: 0.85 },
  ],
});

export const memories = [
  { image: memory01, caption: "" },
  { image: memory02, caption: "" },
  { image: memory03, caption: "" },
  { image: memory04, caption: "" },
  { image: memory05, caption: "" },
  { image: memory06, caption: "" },
  { image: memory07, caption: "" },
  { image: memory08, caption: "" },
];
