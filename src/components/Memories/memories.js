import { memories as placeholderMemories } from "./placeholders";

/*
 * REAL PHOTOS — drop them in and you're done.
 *
 *   src/assets/memories/
 *
 * Every .jpg / .jpeg / .png / .webp in that folder is picked up automatically
 * and bundled by Vite. No code change needed to add, remove or reorder photos.
 *
 * ORDER: files are sorted by filename, so prefix them to control the sequence:
 *   01-cafeteria.jpg, 02-team.jpg, 03-street.jpg …
 * (Order only sets which photo is drawn first from each shuffled round —
 *  the reveal itself is deliberately random.)
 *
 * CAPTIONS: optional. Add an entry here keyed by filename to caption a photo;
 * anything not listed simply has no caption.
 */
const CAPTIONS = {
  // "03-street.jpg": "that late-night chai run",
};

const files = import.meta.glob("../../assets/memories/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP}", {
  eager: true,
  import: "default",
});

const real = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, image]) => ({
    image,
    caption: CAPTIONS[path.split("/").pop()] ?? "",
  }));

/** Real photos when they exist, otherwise the placeholder set. */
export const memories = real.length > 0 ? real : placeholderMemories;

export const usingPlaceholders = real.length === 0;
