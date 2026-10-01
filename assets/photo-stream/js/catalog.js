import { NF, MAX_CHAPTERS, setThreadCount } from './stories.js';

// Shared by the browser and the offline catalog check. No DOM or WebGL dependencies.
export function validateCatalog(catalog, data) {
  const fail = message => { throw new Error(message); };
  const text = value => typeof value === 'string' && value.trim().length > 0;
  if (!Array.isArray(catalog?.photos) || !catalog.photos.length) fail('photos.json must contain at least one photo.');
  if (!Array.isArray(data?.stories)) fail('stories.json must contain a stories array.');
  const ids = new Set();
  const photos = catalog.photos.map(p => {
    if (!text(p?.id) || ids.has(p.id)) fail(`Missing or duplicate photo id: ${p?.id}`);
    if (!text(p.src) || !/^assets\/photos\/[\w./-]+$/.test(p.src) || p.src.split('/').includes('..')) {
      fail(`Photo ${p.id}: src must be a local path under assets/photos/ (use filenames without spaces).`);
    }
    ids.add(p.id);
    return { ...p, description: p.description ?? '', photographer: p.photographer ?? '', avg: [0.5, 0.5, 0.5] };
  });
  const lines = new Set(), storyIds = new Set();
  const authored = data.stories.map((s, k) => {
    if (!text(s?.id) || storyIds.has(s.id)) fail(`Missing or duplicate story id: ${s?.id}`);
    if (/^line-\d+$/.test(s.id)) fail(`Story ${s.id}: line-N ids are reserved for generated stories.`);
    if (!text(s.title)) fail(`Story ${s.id} needs a title.`);
    const line = s.line ?? Math.min(NF - 1, Math.round((k + 0.5) * NF / data.stories.length));
    if (!Number.isInteger(line) || line < 0 || line >= NF || lines.has(line)) fail(`Story ${s.id}: invalid or occupied line ${line}.`);
    if (!Array.isArray(s.chapters) || s.chapters.length < 1 || s.chapters.length > MAX_CHAPTERS) {
      fail(`Story ${s.id} must have 1–${MAX_CHAPTERS} chapters.`);
    }
    for (const c of s.chapters) {
      if (!ids.has(String(c?.photo))) fail(`Story ${s.id} references an unknown photo: ${c?.photo}`);
    }
    lines.add(line); storyIds.add(s.id);
    return { ...s, line };
  });
  const journal = data.journal ?? [];
  if (!Array.isArray(journal) || journal.some(entry => !entry || typeof entry !== 'object')) {
    fail('journal must be an array of date/text entries.');
  }
  return { photos, authored, journal };
}

export async function loadCatalog() {
  const bridge = parent.TravelPhotoStreamBridge;
  if (!bridge) throw new Error('请从旅行网页的“照片流”入口打开。');
  const batch = await bridge.readBatch(new URLSearchParams(location.search).get('page'));
  const photos = batch.photos;
  const authored = [];
  // 每八张组成一条真实照片故事，保证本批每张照片都有入口。
  for (let i = 0; i < photos.length; i += MAX_CHAPTERS) {
    const group = photos.slice(i, i + MAX_CHAPTERS);
    authored.push({
      id: 'travel-'+group[0].id, line: authored.length,
      title: [...new Set(group.map(p => p.city))].join(' · '),
      chapters: group.map(p => ({photo:p.id,caption:p.description,date:p.date,text:p.text}))
    });
  }
  setThreadCount(authored.length);
  document.getElementById('batch-count').textContent = `${batch.start}–${batch.end} / ${batch.total} 张` + (batch.failed ? ` · ${batch.failed} 张未能读取` : '');
  for (const [id, step] of [['batch-prev',-1],['batch-next',1]]) {
    const button = document.getElementById(id);
    button.disabled = step < 0 ? batch.page === 0 : batch.page >= batch.pages-1;
    button.onclick = () => location.replace(`?page=${batch.page+step}`);
  }
  const panel = document.getElementById('photo-directory'), toggle = document.getElementById('directory-toggle');
  toggle.onclick = () => {
    panel.hidden = !panel.hidden; toggle.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.querySelector('button')?.focus();
  };
  const grid = panel.querySelector('.directory-grid');
  photos.forEach((photo,i) => {
    const button = document.createElement('button'), image = document.createElement('img'), caption = document.createElement('span');
    button.type = 'button'; image.src = photo.src; image.loading = 'lazy'; image.alt = photo.description;
    caption.textContent = photo.description; button.append(image,caption); grid.append(button);
    button.onclick = () => {
      if (window.__undertow) {
        panel.hidden = true; toggle.setAttribute('aria-expanded','false');
        window.__undertow.openStory(authored[Math.floor(i/MAX_CHAPTERS)].line,{chapter:i%MAX_CHAPTERS});
      } else {
        const preview = document.getElementById('fallback-preview');
        preview.querySelector('img').src = photo.src; preview.querySelector('img').alt = photo.description; preview.hidden = false;
      }
    };
  });
  if (!photos.length) throw new Error('本批照片未能读取，请切换下一批或关闭后重试。');
  return {photos,authored,journal:[]};
}
