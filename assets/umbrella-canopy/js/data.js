// Stories are the catalog's categories. Edit titles, intros, order and the
// paper colour of each story's umbrellas here; photos come from photos.json.
export const STORIES = [
  { id: 'landscape',    title: 'Long Roads',   color: '#e8ad3e', intro: 'Valleys, dunes and mountain roads: the distances in between.' },
  { id: 'botanical',    title: 'Green Hours',  color: '#5fb062', intro: 'Blossom, leaf and forest light, close enough to touch.' },
  { id: 'ocean',        title: 'Salt & Haze',  color: '#2fb3b0', intro: 'Shorelines and open water, mostly seen through mist.' },
  { id: 'urban',        title: 'City Weather', color: '#e0483f', intro: 'Rain on glass, lights at night, rooftops and rails.' },
  { id: 'architecture', title: 'Built Light',  color: '#5b84dc', intro: 'Bridges, piers and rooms that hold the light.' },
  { id: 'detail',       title: 'Small Things', color: '#e57fa6', intro: 'Stone, fence and wall: the easily overlooked.' },
];

export async function loadCatalog(url = 'photos.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  const json = await res.json();
  const photos = (json.photos || []).map((p) => {
    // picsum source urls end in /<w>/<h>.jpg which gives the aspect before the image loads
    const m = /\/(\d+)\/(\d+)\.jpg$/.exec(p.source_url || '');
    const aspect = m ? Number(m[2]) / Number(m[1]) : 2 / 3;
    const file = p.src.split('/').pop();
    return {
      ...p,
      aspect,
      full: `assets/photos/${file}`,
      thumb: `assets/thumbs/${file.replace(/\.\w+$/, '.webp')}`, // 768 px WebP copies of the photos
    };
  });

  const known = new Set(STORIES.map((s) => s.id));
  const stories = STORIES.map((s) => ({ ...s, photos: photos.filter((p) => p.category === s.id) }));
  // Any category not listed above still gets shown, as its own neutral story.
  const extra = [...new Set(photos.map((p) => p.category))].filter((c) => !known.has(c));
  for (const c of extra) {
    stories.push({ id: c, title: c[0].toUpperCase() + c.slice(1), color: '#d9d4cc', intro: '', photos: photos.filter((p) => p.category === c) });
  }
  const nonEmpty = stories.filter((s) => s.photos.length);
  nonEmpty.forEach((s) => s.photos.forEach((p, i) => { p.story = s; p.indexInStory = i; }));
  return { photos: nonEmpty.flatMap((s) => s.photos), stories: nonEmpty };
}

// A few representative colours per photo, used to dye the flower carpet.
// photos.json carries them precomputed ("palette"); this measures any photo without one.
export function extractPalette(img, count = 6) {
  const size = 36;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    let e = buckets.get(key);
    if (!e) { e = { n: 0, r: 0, g: 0, b: 0, sat: 0 }; buckets.set(key, e); }
    e.n++; e.r += r; e.g += g; e.b += b; e.sat += sat;
  }
  const list = [...buckets.values()].map((e) => ({
    rgb: [e.r / e.n / 255, e.g / e.n / 255, e.b / e.n / 255],
    score: e.n * (0.35 + e.sat / e.n),
  }));
  list.sort((a, b) => b.score - a.score);
  const out = [];
  for (const it of list) {
    if (out.every((o) => Math.hypot(o[0] - it.rgb[0], o[1] - it.rgb[1], o[2] - it.rgb[2]) > 0.16)) out.push(it.rgb);
    if (out.length >= count) break;
  }
  return out.length ? out : [[0.9, 0.88, 0.84]];
}

