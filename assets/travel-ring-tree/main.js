import { createTreeCatalog } from './data.js';
import { TravelRingTreeScene } from './scene.js';

const $ = id => document.getElementById(id);
const catalog = createTreeCatalog(window.travelRingTreeRecords || []);
const state = { year: null, city: null, photo: null, grouped: false, rotating: false, direction: 1, speed: 1 };
let scene = null, hostActive = true, previousFocus = null, previousView = null;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const running = () => hostActive && !document.hidden;
function syncRunning() { scene?.setRunning(running()); }
function syncRotation() {
  $('rotation-toggle').textContent = state.rotating ? '停止旋转' : '自动旋转';
  $('rotation-toggle').setAttribute('aria-pressed', String(state.rotating));
  $('rotation-direction').textContent = state.direction === 1 ? '顺时针' : '逆时针';
  $('rotation-speed').textContent = `速度 ${state.speed}×`;
  scene?.setRotation(state.rotating, state.direction, state.speed);
}
function visiblePhotos() {
  return (state.city ? state.city.photos : []).filter(p => state.year === null || p.year === state.year);
}
function renderPhotos() {
  const photos = visiblePhotos();
  $('city-status').textContent = !state.city ? '请选择城市查看照片' : photos.length ? `${state.city.title}：${photos.length} 张照片` : '该城市在所选年份暂无照片，试试其他年份。';
  $('city-photos').replaceChildren(...photos.map(photo => {
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label', `查看${photo.title}照片`);
    const image = document.createElement('img'); image.src = photo.src; image.alt = photo.title; image.loading = 'lazy';
    image.addEventListener('error', () => { image.hidden = true; button.textContent = '查看'; }, { once: true });
    button.append(image); button.addEventListener('click', () => openPhoto(photo)); return button;
  }));
  for (const button of $('city-nav').querySelectorAll('[data-city]')) button.setAttribute('aria-pressed', String(button.dataset.city === state.city?.id));
}
function selectYear(year) {
  closePhoto();
  state.year = year; state.city = null; state.rotating = false; syncRotation(); scene?.setFocusStory(null);
  if (scene && (state.grouped || year !== null)) scene.flyToYear(year);
  else scene?.setYear(year);
  for (const b of $('years').children) b.setAttribute('aria-pressed', String(b.dataset.year === (year === null ? 'all' : year === '年份未确定' ? 'unknown' : String(year))));
  renderCityNav(); renderPhotos(); syncClusterUI();
}
function selectCity(city) {
  closePhoto();
  if (scene?.yearTransition) scene.setYear(state.year);
  const cluster = scene?.cityClusters.find(c => c.city === city);
  if (cluster && scene.hiddenRings.has(cluster.ringIndex)) scene.setRingVisible(cluster.ringIndex, true);
  state.city = city; scene?.setFocusStory(city); renderPhotos(); syncClusterUI();
  if (scene && city) scene.flyTo(scene.storyView(city), 1);
}
function syncClusterUI() {
  $('city-layout').textContent = state.grouped ? '返回自然布局' : '按城市分组';
  $('city-layout').setAttribute('aria-pressed', String(state.grouped));
  for (const button of $('city-nav').querySelectorAll('[data-ring-toggle]')) {
    const hidden = scene.hiddenRings.has(Number(button.dataset.ringToggle));
    button.textContent = hidden ? '显示本圈' : '隐藏本圈'; button.setAttribute('aria-pressed', String(hidden));
  }
}
function renderCityNav() {
  $('city-nav').replaceChildren();
  const addCity = (city, parent) => {
    if (state.year !== null && !city.photos.some(p => p.year === state.year)) return;
    const button = document.createElement('button'); button.type = 'button'; button.dataset.city = city.id; button.textContent = city.title;
    button.addEventListener('click', () => { selectYear(null); selectCity(city); }); parent.append(button);
  };
  if (!state.grouped || !scene) { catalog.cities.forEach(city => addCity(city, $('city-nav'))); return; }
  const rings = [...new Set(scene.cityClusters.filter(c => state.year === null || c.city.photos.some(p => p.year === state.year)).map(c => c.ringIndex))].sort((a, b) => a - b);
  for (const index of rings) {
    const section = document.createElement('section'); section.dataset.ringSection = index;
    const heading = document.createElement('div'); heading.className = 'ring-heading';
    const title = document.createElement('span'); title.textContent = index === 0 ? '外圈' : index === 1 ? '内圈' : `内圈（${index}）`;
    const toggle = document.createElement('button'); toggle.type = 'button'; toggle.dataset.ringToggle = index;
    toggle.addEventListener('click', () => {
      const visible = scene.hiddenRings.has(index); scene.setRingVisible(index, visible);
      if (!visible && scene.cityClusters.some(c => c.ringIndex === index && c.city === state.city)) selectCity(null);
      syncClusterUI();
    });
    heading.append(title, toggle); section.append(heading);
    scene.cityClusters.filter(c => c.ringIndex === index).forEach(c => addCity(c.city, section));
    $('city-nav').append(section);
  }
  syncClusterUI();
}
function openPhoto(photo) {
  const opening = !state.photo;
  if (opening) { previousFocus = document.activeElement; previousView = scene ? { pos: scene.camera.position.clone(), target: scene.controls.target.clone() } : null; }
  if (scene?.yearTransition) scene.setYear(state.year);
  state.rotating = false; syncRotation();
  state.photo = photo; scene?.setSelected(photo); syncRunning();
  $('photo-title').textContent = photo.title;
  $('photo-date').textContent = photo.date || String(photo.year);
  $('photo-error').hidden = true; $('original-photo').hidden = false;
  $('original-photo').alt = photo.title; $('original-photo').src = photo.full || photo.src;
  $('photo-dialog').hidden = false; document.body.classList.add('photo-open');
  if (opening) parent.postMessage({ type: 'tree:photo-panel', open: true }, '*');
  if (opening) $('photo-close').focus();
  const list = photoList(); $('photo-prev').disabled = $('photo-next').disabled = list.length < 2;
  $('photo-city').textContent = photo.story.title; $('photo-count').textContent = `${list.indexOf(photo) + 1} / ${list.length}`;
  $('photo-strip').replaceChildren(...list.map(p => {
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label', `查看${p.title}第${list.indexOf(p) + 1}张照片`); button.setAttribute('aria-pressed', String(p === photo));
    const img = document.createElement('img'); img.src = p.src; img.alt = p.title; img.loading = 'lazy'; button.append(img); button.addEventListener('click', () => openPhoto(p)); return button;
  }));
  if (scene) { scene.setInset($('photo-dialog').offsetWidth, 0); scene._applyInset(1); scene.flyTo(scene.photoView(photo), 1); }
}
function photoList() {
  const list = state.photo?.story.photos || [];
  return list.filter(p => state.year === null || p.year === state.year);
}
function closePhoto() {
  if (!state.photo) return;
  state.photo = null; scene?.setSelected(null); $('photo-dialog').hidden = true; document.body.classList.remove('photo-open');
  parent.postMessage({ type: 'tree:photo-panel', open: false }, '*');
  if (scene) { scene.setInset(0, 0); if (previousView) scene.flyTo(previousView, 1); }
  previousView = null; $('photo-strip').replaceChildren();
  $('original-photo').removeAttribute('src'); syncRunning(); previousFocus?.focus();
}
function stepPhoto(dir) {
  const list = photoList(), index = list.indexOf(state.photo);
  if (list.length) openPhoto(list[(index + dir + list.length) % list.length]);
}
function buildUI() {
  $('city-toggle').addEventListener('click', () => { const hidden = !$('city-nav').hidden; $('city-nav').hidden = hidden; $('city-toggle').textContent = hidden ? '显示城市' : '收起城市'; $('city-toggle').setAttribute('aria-expanded', String(!hidden)); });
  $('summary').textContent = `${catalog.photos.length} 张照片 · ${catalog.cities.length} 座城市`;
  const years = [null, ...catalog.years];
  if (catalog.photos.some(p => p.year === '年份未确定')) years.push('年份未确定');
  for (const year of years) {
    const button = document.createElement('button'); button.type = 'button';
    button.dataset.year = year === null ? 'all' : year === '年份未确定' ? 'unknown' : String(year);
    button.textContent = year === null ? '全部' : String(year);
    button.addEventListener('click', () => selectYear(year)); $('years').append(button);
  }
  renderCityNav();
  selectYear(null);
  $('rotation-toggle').addEventListener('click', () => { state.rotating = !state.rotating; syncRotation(); });
  $('rotation-direction').addEventListener('click', () => { state.direction *= -1; syncRotation(); });
  $('rotation-speed').addEventListener('click', () => { state.speed = state.speed % 3 + 1; syncRotation(); });
  $('whole-view').addEventListener('click', () => { closePhoto(); selectCity(null); if (scene) scene.flyTo(scene.wholeView(.35), 1); });
  $('city-layout').addEventListener('click', () => {
    if (!scene) return;
    closePhoto(); state.grouped = !state.grouped; scene.setClusterMode(state.grouped); renderCityNav(); selectCity(null);
    scene.flyTo(scene.wholeView(.35), 1);
  });
  $('photo-close').addEventListener('click', closePhoto);
  $('photo-prev').addEventListener('click', () => stepPhoto(-1)); $('photo-next').addEventListener('click', () => stepPhoto(1));
  $('original-photo').addEventListener('error', () => { $('original-photo').hidden = true; $('photo-error').hidden = false; });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); state.photo ? closePhoto() : parent.postMessage({ type: 'tree:close' }, '*'); }
    if (state.photo && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); stepPhoto(e.key === 'ArrowLeft' ? -1 : 1); }
    if (!state.photo && e.key === 'Tab' && parent !== window) {
      const buttons = [...document.querySelectorAll('button:not(:disabled)')].filter(b => b.getClientRects().length);
      if (document.activeElement === (e.shiftKey ? buttons[0] : buttons.at(-1))) {
        e.preventDefault(); parent.postMessage({ type: 'tree:focus-close' }, '*');
      }
    }
  });
}
function bindPointer() {
  const canvas = $('scene'); let down = null;
  canvas.addEventListener('pointerdown', e => {
    scene.cancelYearFocus();
    if (e.button !== 0) return;
    const rope = scene.pick(e.clientX, e.clientY)?.rope;
    down = { x: e.clientX, y: e.clientY, id: e.pointerId, rope };
    if (rope) { e.preventDefault(); e.stopImmediatePropagation(); scene.beginRopeDrag(rope, e.clientX, e.clientY); canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; }
  }, true);
  canvas.addEventListener('wheel', () => scene.cancelYearFocus(), { capture: true, passive: true });
  const releaseRope = () => { scene.endRopeDrag(); if (down && canvas.hasPointerCapture(down.id)) canvas.releasePointerCapture(down.id); down = null; canvas.style.cursor = ''; };
  canvas.addEventListener('pointercancel', releaseRope);
  canvas.addEventListener('lostpointercapture', releaseRope);
  window.addEventListener('blur', releaseRope);
  canvas.addEventListener('pointerup', e => {
    if (down?.rope) { e.preventDefault(); e.stopImmediatePropagation(); releaseRope(); return; }
    if (down?.id === e.pointerId && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) {
      const hit = scene.pick(e.clientX, e.clientY);
      if (hit?.city) selectCity(hit.city);
      else if (hit?.photo && (state.year === null || hit.photo.year === state.year)) openPhoto(hit.photo);
    }
    down = null;
  }, true);
  canvas.addEventListener('pointermove', e => {
    if (down?.rope) { e.preventDefault(); e.stopImmediatePropagation(); scene.moveRopeDrag(e.clientX, e.clientY); return; }
    if (!down) { const hit = scene.pick(e.clientX, e.clientY); canvas.style.cursor = hit?.rope ? 'grab' : ''; scene.hoveredCity = hit?.city || hit?.photo?.story || null; scene.setHovered(hit?.photo || null); }
  }, true);
  canvas.addEventListener('pointerleave', () => { if (!down?.rope) canvas.style.cursor = ''; scene.hoveredCity = null; scene.setHovered(null); });
}
function loadTexture(photo) {
  return new Promise(resolve => {
    const image = new Image(); let done = false;
    const finish = () => { if (!done) { done = true; clearTimeout(timer); resolve(); } };
    const timer = setTimeout(finish, 15000);
    image.onload = () => {
      if (done) return;
      try {
        const ratio = Math.min(1, 768 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio)); canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        scene.setPhotoTexture(photo, canvas);
      } catch { /* The original remains available in the city viewer. */ }
      finish();
    };
    image.onerror = finish; image.src = photo.src;
  });
}
async function init() {
  buildUI();
  if (!catalog.photos.length) { $('loading').textContent = '还没有城市照片，请先在城市详情中保存照片。'; return; }
  try { scene = new TravelRingTreeScene($('scene'), { reducedMotion }); }
  catch { $('loading').hidden = true; $('fallback').hidden = false; document.body.classList.add('fallback'); return; }
  scene.buildRoom(); scene.setPhotos(catalog.photos, catalog.cities, catalog.years); bindPointer();
  const view = scene.wholeView(.35);
  scene.camera.position.copy(view.pos); scene.controls.target.copy(view.target); scene.camera.lookAt(view.target);
  await Promise.all([scene.compile(), ...catalog.photos.map(loadTexture)]);
  scene.settle(.5); scene.renderFirst(); $('loading').hidden = true; syncRunning();
  scene.on('contextrestored', () => { scene.resetPhotoTextures(); Promise.all(catalog.photos.map(loadTexture)).then(() => { scene.redraw(); syncRunning(); }); });
}
addEventListener('message', e => { if (e.source === parent && e.data?.type === 'platform:visibility') { hostActive = Boolean(e.data.active); syncRunning(); } });
document.addEventListener('visibilitychange', syncRunning);
addEventListener('resize', () => { if (state.photo) scene?.setInset($('photo-dialog').offsetWidth, 0); });
addEventListener('pagehide', () => scene?.releaseContext());
addEventListener('pageshow', e => { if (e.persisted) scene?.restoreContext(); });
const ready = init().catch(error => { scene?.setRunning(false); $('loading').textContent = '场景加载失败，仍可按城市查看照片。'; $('loading').style.inset = '120px 20px auto'; $('fallback').hidden = false; document.body.classList.add('fallback'); console.error('旅行年轮树', error); });
window.travelTree = { state, catalog, ready, get scene() { return scene; } };
