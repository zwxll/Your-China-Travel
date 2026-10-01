import { setThreadCount } from './stories.js';

export async function loadCatalog() {
  const bridge = parent.TravelPhotoStreamBridge;
  if (!bridge) throw new Error('请从旅行网页的“照片流”入口打开。');
  const catalog = await bridge.readCatalog();
  const photos = catalog.photos, cities = new Map();
  for (const photo of photos) {
    if (!cities.has(photo.cityKey)) cities.set(photo.cityKey, {id:'city-'+photo.cityKey, line:cities.size, title:photo.city, chapters:[]});
    const story = cities.get(photo.cityKey);
    photo.line = story.line; photo.chapter = story.chapters.length;
    story.chapters.push({photo:photo.id,caption:photo.description,date:photo.date,text:photo.text});
  }
  const authored = [...cities.values()];
  setThreadCount(authored.length);
  document.getElementById('photo-count').textContent = authored.length+' 座城市 · '+photos.length+' 张照片' + (catalog.failed ? ' · '+catalog.failed+' 张未能读取' : '');
  const panel = document.getElementById('photo-directory'), toggle = document.getElementById('directory-toggle');
  toggle.onclick = () => {
    panel.hidden = !panel.hidden; toggle.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.querySelector('button')?.focus();
  };
  const grid = panel.querySelector('.directory-grid');
  photos.forEach(photo => {
    const button = document.createElement('button'), image = document.createElement('img'), caption = document.createElement('span');
    button.type = 'button'; image.src = photo.src; image.loading = 'lazy'; image.alt = photo.description;
    caption.textContent = photo.description; button.append(image,caption); grid.append(button);
    button.onclick = () => {
      if (window.__undertow) {
        panel.hidden = true; toggle.setAttribute('aria-expanded','false');
        window.__undertow.openStory(photo.line,{chapter:photo.chapter});
      } else {
        const preview = document.getElementById('fallback-preview');
        preview.querySelector('img').src = photo.src; preview.querySelector('img').alt = photo.description; preview.hidden = false;
      }
    };
  });
  if (!photos.length) throw new Error('照片未能读取，请关闭后重试。');
  return {photos,authored,journal:[]};
}
