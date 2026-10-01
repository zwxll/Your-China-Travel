import { clamp } from './math.js';
export let NF = 48;
export function setThreadCount(count) { NF = count; }
export const MAX_CHAPTERS = 8;

// Only stories supplied by the user's photo catalog are rendered.
export function buildStories(photos, authored = [], journal = []) {
  const stories = authored.map(story=>({...story,chapters:story.chapters.map(chapter=>({...chapter}))}));
  const byId = new Map(photos.map((p, j) => [p.id, j]));
  for (const s of stories) {
    s.chapters = s.chapters.map(c => {
      const layer = byId.get(String(c.photo)), p = photos[layer];
      return { ...c, layer, src: p.src, aspect: p.aspect, caption: c.caption ?? p.description, credit: c.credit ?? p.photographer };
    });
    // Journal entries: authored text wins; otherwise the shared template, spread so that every
    // story, however short, begins with the first entry and ends with the last.
    const n = s.chapters.length, T = journal.length;
    s.chapters.forEach((c, k) => {
      const t = T ? journal[Math.round(k * (T - 1) / Math.max(1, n - 1))] : {};
      c.date = c.date ?? t.date ?? '';
      c.text = c.text ?? t.text ?? '';
    });
    colourStory(s, photos);
  }
  return stories;
}

// A luminous version of the story's average colour: its thread's colour and its page's accent.
function colourStory(s, photos) {
  let r = 0, g = 0, b = 0;
  for (const c of s.chapters) { const a = photos[c.layer].avg; r += a[0]; g += a[1]; b += a[2]; }
  const n = s.chapters.length; r /= n; g /= n; b /= n;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  const sat = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (mx !== mn) h = mx === r ? ((g - b) / (mx - mn) + 6) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
  const S = clamp(sat * 1.9 + 0.2, 0.45, 0.9), L = 0.62;
  const C = (1 - Math.abs(2 * L - 1)) * S, X = C * (1 - Math.abs((h % 2) - 1)), m = L - C / 2;
  const [rr, gg, bb] = h < 1 ? [C, X, 0] : h < 2 ? [X, C, 0] : h < 3 ? [0, C, X] : h < 4 ? [0, X, C] : h < 5 ? [X, 0, C] : [C, 0, X];
  s.col = [rr + m, gg + m, bb + m];
  s.rgb = s.col.map(v => Math.round(v * 255)).join(' ');
}
