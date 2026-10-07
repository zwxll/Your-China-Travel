import * as THREE from 'three';
import { loadCatalog, extractPalette } from './travel-data.js';
import { CanopyScene } from './scene.js';

const $ = (sel) => document.querySelector(sel);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPhone = () => window.innerWidth <= 760;

const state = {
  mode: 'whole', // 'whole' | 'story' | 'photo'
  story: null,
  photo: null,
  photos: [],
  stories: [],
};

let scene;
let readyResolve;
const ready = new Promise((r) => { readyResolve = r; });

// ---------------------------------------------------------------------------
// The platform feed pauses works that are off screen; the index also hides the
// scene completely once it has faded in. Standalone, the canopy simply runs.
// ---------------------------------------------------------------------------
let hostActive = true;
let indexCovers = false;
const isRunning = () => hostActive && !document.hidden && !indexCovers;
function syncRunning() {
  document.documentElement.classList.toggle('is-paused', !isRunning());
  if (scene) scene.setRunning(isRunning());
}
addEventListener('message', (event) => {
  if (event.source !== parent || event.data?.type !== 'platform:visibility') return;
  hostActive = Boolean(event.data.active);
  syncRunning();
});
document.addEventListener('visibilitychange', syncRunning);
if (parent !== window) parent.postMessage({ type: 'platform:hello' }, '*');

// Give the page a turn between the heavier start-up steps.
const nextTask = () => globalThis.scheduler?.yield?.() ?? new Promise((r) => setTimeout(r, 0));

// ---------------------------------------------------------------------------
async function init() {
  const canvas = $('#scene');
  let catalog;
  try {
    catalog = await loadCatalog();
  } catch (err) {
    $('#loader-text').textContent = '城市照片加载失败，请返回后重试。';
    console.error(err);
    return;
  }
  state.photos = catalog.photos;
  state.stories = catalog.stories;
  if(!state.photos.length){$('#loader-text').textContent='还没有城市照片，请先在城市详情中保存照片。';readyResolve();return;}
  $('#subtitle').textContent = `${state.photos.length} photographs in ${state.stories.length} stories, hung like crystals`;
  // start downloading and decoding the photographs straight away
  const images = state.photos.map((p) => loadImage(p.thumb));
  images.forEach((img) => img.catch(() => {}));

  buildChips();
  buildIndex();
  await nextTask();

  try {
    scene = new CanopyScene(canvas, { reducedMotion });
  } catch (err) {
    console.warn('WebGL unavailable, showing the index instead.', err);
    $('#loader').classList.add('is-done');
    openIndex();
    $('#index-close').hidden = true;
    readyResolve();
    return;
  }
  await nextTask();
  scene.buildRoom();
  await nextTask();
  scene.setPhotos(state.photos, state.stories);

  // opening view: a little further back, then drift in once photos are hung
  const whole = scene.wholeView(0.35);
  const start = whole.pos.clone().multiplyScalar(1.25);
  start.y = 2.2;
  scene.camera.position.copy(start);
  scene.controls.target.copy(whole.target);
  scene.camera.lookAt(whole.target);

  bindPointer(canvas);
  bindUI();
  scene.on('frame', onFrame);
  scene.on('interact', () => {
    setRotation(false);
    hideTooltipIfDragging();
    setTimeout(() => $('#hint').classList.add('is-hidden'), 4000);
  });
  scene.on('contextrestored', () => {
    // the uploaded photos were lost with the context; fetch them again (HTTP cache)
    scene.resetPhotoTextures();
    scene.setRunning(isRunning());
    scene.redraw();
    loadTextures(state.photos.map((p) => loadImage(p.thumb))).then(() => scene.redraw());
  });
  window.addEventListener('resize', () => {
    applyInset();
  });
  window.addEventListener('pagehide', () => scene.releaseContext());
  window.addEventListener('pageshow', (e) => { if (e.persisted) scene.restoreContext(); });

  await nextTask();
  // shaders compile in parallel while the photos arrive
  const [, missingPalette] = await Promise.all([scene.compile(), loadTextures(images)]);
  if (missingPalette) scene.recolorCarpet();
  scene.settle();

  if (!applyHash()) scene.flyTo(scene.wholeView(0.35), 2.4);
  // draw before the loader goes, so the canvas is never seen empty
  scene.renderFirst();
  $('#loader').classList.add('is-done');
  syncRunning(); // the intro flight waits here until the work is on screen
  readyResolve();
  if (parent !== window) {
    let sent = false;
    const send = () => { if (!sent) { sent = true; parent.postMessage({ type: 'platform:ready' }, '*'); } };
    requestAnimationFrame(send);
    setTimeout(send, 100); // rAF may not fire while the frame is hidden
  }
}

// Fetch and decode a photograph off the main thread (ImageBitmap), or as an <img>
// where createImageBitmap is missing. Both are uploaded with flipY = false.
function loadImage(url) {
  if (typeof createImageBitmap === 'undefined') return new THREE.ImageLoader().loadAsync(url);
  return fetch(url)
    .then((res) => { if (!res.ok) throw new Error(`${res.status} ${url}`); return res.blob(); })
    .then((blob) => createImageBitmap(blob));
}

// Resolves once every photo is on its card (or after 15 s), with whether any
// photo had no palette in photos.json and needed one measured here.
function loadTextures(images) {
  let done = 0;
  let measured = false;
  const total = state.photos.length;
  const text = $('#loader-text');
  return new Promise((resolve) => {
    const finish = () => resolve(measured);
    const timer = setTimeout(finish, 15000);
    state.photos.forEach((p, i) => {
      images[i].then(
        // one upload per task, so arrivals never pile up into one long frame
        (img) => setTimeout(() => {
          if (!p.palette) {
            try { p.palette = extractPalette(img); measured = true; } catch { p.palette = null; }
          }
          scene.setPhotoTexture(p, img);
          step();
        }),
        () => { console.warn('Missing photo', p.thumb); step(); },
      );
    });
    function step() {
      done++;
      text.textContent = `正在悬挂照片… ${done} / ${total}`;
      if (done >= total) { clearTimeout(timer); finish(); }
    }
  });
}

// ---------------------------------------------------------------------------
// UI construction
// ---------------------------------------------------------------------------
function buildChips() {
  const nav = $('#chips');
  nav.innerHTML = '';
  const cityName = document.createElement('div');
  cityName.id = 'chip-city-name';
  cityName.hidden = true;
  cityName.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cityName);
  const hideCityName = () => { cityName.hidden = true; };
  nav.addEventListener('scroll', hideCityName);
  window.addEventListener('resize', hideCityName);
  for (const s of state.stories) {
    const b = document.createElement('button');
    b.className = 'chip';
    b.type = 'button';
    b.style.setProperty('--c', s.color);
    b.dataset.story = s.id;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<span class="dot" aria-hidden="true"></span>';
    b.setAttribute('aria-label', s.title);
    const showCityName = () => {
      const dot = b.querySelector('.dot').getBoundingClientRect();
      cityName.textContent = s.title;
      cityName.hidden = false;
      const halfWidth = cityName.getBoundingClientRect().width / 2;
      cityName.style.left = `${Math.max(halfWidth + 8, Math.min(innerWidth - halfWidth - 8, dot.left + dot.width / 2))}px`;
      cityName.style.top = `${nav.getBoundingClientRect().top - 14}px`;
    };
    b.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') showCityName(); });
    b.addEventListener('pointerleave', hideCityName);
    b.addEventListener('focus', showCityName);
    b.addEventListener('blur', hideCityName);
    b.addEventListener('click', () => {
      hideCityName();
      if (state.story === s && state.mode === 'story') goWhole();
      else selectStory(s);
    });
    nav.appendChild(b);
  }
}

function buildIndex() {
  const list = $('#index-list');
  list.innerHTML = '';
  for (const s of state.stories) {
    const sec = document.createElement('section');
    sec.className = 'index-story';
    sec.innerHTML = `<h3 style="--c:${s.color}"><span class="dot"></span>${escapeHtml(s.title)} <span class="count">${s.photos.length} 张照片</span></h3><p>${escapeHtml(s.intro)}</p>`;
    const grid = document.createElement('div');
    grid.className = 'index-grid';
    for (const p of s.photos) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'index-item';
      b.innerHTML = `<img loading="lazy" src="${p.thumb}" alt=""><span>${escapeHtml(p.description)}</span>`;
      b.setAttribute('aria-label', `${p.description}，查看原图`);
      b.addEventListener('click', () => {
        if (!scene) { window.open(p.full, '_blank', 'noopener'); return; } // no WebGL: just show the photo
        closeIndex();
        openPhoto(p);
      });
      grid.appendChild(b);
    }
    sec.appendChild(grid);
    list.appendChild(sec);
  }
}

function renderStoryCard(story) {
  const card = $('#story-card');
  if (!story || state.mode !== 'story') { card.hidden = true; return; }
  card.hidden = false;
  card.style.setProperty('--c', story.color);
  card.querySelector('.dot').style.setProperty('--c', story.color);
  $('#story-title').textContent = story.title;
  $('#story-intro').textContent = `${story.photos.length} 张城市旅行照片`;
  fillStrip($('#story-strip'), story);
}

function fillStrip(strip, story) {
  strip.innerHTML = '';
  strip.style.setProperty('--c', story.color);
  for (const p of story.photos) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'thumb';
    b.setAttribute('role', 'listitem');
    b.style.backgroundImage = `url("${p.thumb}")`;
    b.setAttribute('aria-label', p.description);
    b.title = p.description;
    if (p === state.photo) b.setAttribute('aria-current', 'true');
    b.addEventListener('click', () => openPhoto(p));
    b.addEventListener('mouseenter', () => scene.setHovered(p));
    b.addEventListener('mouseleave', () => scene.setHovered(null));
    strip.appendChild(b);
  }
}

function updateChips() {
  document.querySelectorAll('.chip').forEach((b) => {
    b.setAttribute('aria-pressed', String(!!state.story && b.dataset.story === state.story.id && state.mode !== 'whole'));
  });
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function goWhole({ fly = true } = {}) {
  closeDetailPanel();
  state.mode = 'whole';
  state.story = null;
  state.photo = null;
  scene.setSelected(null);
  scene.setFocusStory(null);
  renderStoryCard(null);
  updateChips();
  applyInset();
  if (fly) scene.flyTo(scene.wholeView(), 1.6);
  setHash('');
}

function selectStory(story, { fly = true } = {}) {
  closeDetailPanel();
  state.mode = 'story';
  state.story = story;
  state.photo = null;
  scene.setSelected(null);
  scene.setFocusStory(story);
  renderStoryCard(story);
  updateChips();
  applyInset();
  if (fly) scene.flyTo(scene.storyView(story), 1.6);
  setHash(`story/${story.id}`);
}

function openPhoto(photo, { fly = true } = {}) {
  setRotation(false);
  state.mode = 'photo';
  state.story = photo.story;
  state.photo = photo;
  scene.setSelected(photo);
  scene.setFocusStory(photo.story);
  scene.setHovered(null);
  hideTooltip();
  renderStoryCard(photo.story);
  updateChips();
  fillDetail(photo);
  document.body.classList.add('detail-open');
  $('#detail').setAttribute('aria-hidden', 'false');
  applyInset();
  if (fly) scene.flyTo(scene.photoView(photo), 1.5);
  setHash(`photo/${photo.id}`);
}

function closeDetailPanel() {
  document.body.classList.remove('detail-open');
  $('#detail').setAttribute('aria-hidden', 'true');
}

function stepBack() {
  if (!$('#index').hidden) { if (scene) closeIndex(); return; }
  if (state.mode === 'photo') selectStory(state.photo.story);
  else if (state.mode === 'story') goWhole();
}

function stepPhoto(dir) {
  if (!state.photo) return;
  const list = state.photo.story.photos;
  const i = (state.photo.indexInStory + dir + list.length) % list.length;
  openPhoto(list[i]);
}

function fillDetail(p) {
  const img = $('#d-img');
  img.src = p.full;
  img.alt = p.description;
  img.style.aspectRatio = `${1 / p.aspect}`;
  $('#detail .d-story .dot').style.setProperty('--c', p.story.color);
  $('#d-story').textContent = p.story.title;
  $('#d-count').textContent = `${p.indexInStory + 1} / ${p.story.photos.length}`;
  $('#d-title').textContent = p.description;
  $('#d-meta').textContent = p.date||'尚未记录';
  const a = $('#d-source');
  if (p.source_page) { a.href = p.source_page; a.parentElement.hidden = false; } else a.parentElement.hidden = true;
  $('#d-more-story').textContent = p.story.title;
  fillStrip($('#d-strip'), p.story);
  const many = p.story.photos.length > 1;
  $('#d-prev').disabled = !many;
  $('#d-next').disabled = !many;
}

function applyInset() {
  if (!scene) return;
  if (state.mode !== 'photo') scene.setInset(0, 0);
  else if (isPhone()) scene.setInset(0, Math.round($('#detail').offsetHeight || window.innerHeight * 0.4));
  else scene.setInset(400, 0);
}

// ---------------------------------------------------------------------------
// Index dialog
// ---------------------------------------------------------------------------
let lastFocus = null;
function openIndex() {
  lastFocus = document.activeElement;
  $('#index').hidden = false;
  $('#index-close').focus();
}
function closeIndex() {
  $('#index').hidden = true;
  indexCovers = false;
  syncRunning();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
// Once faded in, the index hides the scene behind a still blur: stop drawing it.
$('#index').addEventListener('animationend', (e) => {
  if (e.target !== e.currentTarget || e.currentTarget.hidden) return;
  indexCovers = true;
  syncRunning();
});

// ---------------------------------------------------------------------------
// Pointer: hover tooltip and click-to-open
// ---------------------------------------------------------------------------
const pointer = { x: 0, y: 0, inside: false, down: null, dragging: false, type: 'mouse', dirty: false };
let canvasEl;

function bindPointer(canvas) {
  canvasEl = canvas;
  canvas.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.inside = true; pointer.type = e.pointerType;
    pointer.dirty = true;
    if (pointer.down && Math.hypot(e.clientX - pointer.down.x, e.clientY - pointer.down.y) > 6) {
      pointer.dragging = true;
      canvas.classList.add('is-grabbing');
    }
  });
  canvas.addEventListener('pointerleave', () => { pointer.inside = false; scene.setHovered(null); hideTooltip(); });
  canvas.addEventListener('pointerdown', (e) => {
    pointer.down = { x: e.clientX, y: e.clientY, t: performance.now() };
    pointer.dragging = false;
    pointer.type = e.pointerType;
  });
  window.addEventListener('pointerup', (e) => {
    const d = pointer.down;
    pointer.down = null;
    canvas.classList.remove('is-grabbing');
    if (!d || e.target !== canvas) return;
    const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
    if (moved > 6 || performance.now() - d.t > 700) return;
    const hit = scene.pick(e.clientX, e.clientY);
    if (hit) openPhoto(hit.photo);
  });
}

let hoverCheckFrame = 0;
const lastPickCam = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), inset: 0 };
// Did anything under a resting pointer move since the last pick?
function sceneMoved() {
  const cam = scene.camera, inset = scene.inset.right + scene.inset.bottom;
  const moved = scene.common.uSway.value > 0 // cards drift on their threads
    || !cam.position.equals(lastPickCam.pos) || !cam.quaternion.equals(lastPickCam.quat) || inset !== lastPickCam.inset;
  lastPickCam.pos.copy(cam.position);
  lastPickCam.quat.copy(cam.quaternion);
  lastPickCam.inset = inset;
  return moved;
}

function onFrame() {
  // hover: re-pick when the pointer moved, and every few frames while things drift
  hoverCheckFrame++;
  if (pointer.inside && pointer.type === 'mouse' && !pointer.dragging && (pointer.dirty || (hoverCheckFrame % 6 === 0 && sceneMoved()))) {
    pointer.dirty = false;
    const hit = scene.pick(pointer.x, pointer.y);
    const photo = hit ? hit.photo : null;
    scene.setHovered(photo);
    canvasEl.classList.toggle('is-pointer', !!photo);
    if (photo && photo !== state.photo) showTooltip(photo, hit.kind);
    else hideTooltip();
  }
  scene.controls.autoRotate = autoRotateAllowed && state.mode !== 'photo' && !scene.flight;
}

let autoRotateAllowed = false, rotationDirection = 1, rotationSpeed = 1;
function setRotation(on) {
  autoRotateAllowed = Boolean(on);
  if (scene) scene.controls.autoRotate = autoRotateAllowed && state.mode !== 'photo' && !scene.flight;
  $('#btn-rotate').textContent = autoRotateAllowed ? '暂停旋转' : '自动旋转';
  $('#btn-rotate').setAttribute('aria-pressed', String(autoRotateAllowed));
}
function syncRotationSpeed() {
  scene.controls.autoRotateSpeed = .35 * rotationDirection * rotationSpeed;
  $('#btn-direction').textContent = rotationDirection === 1 ? '顺时针' : '逆时针';
  $('#btn-speed').textContent = `速度 ${rotationSpeed}×`;
}

// The tooltip's text (and so its size) only changes with the photo under the
// pointer; measure it then, not on every pick.
const tip = { el: null, photo: null, kind: null, w: 0, h: 0, x: null, y: null };
function showTooltip(photo, kind) {
  const tt = tip.el ||= $('#tooltip');
  if (tt.hidden || photo !== tip.photo || kind !== tip.kind) {
    tt.hidden = false;
    tt.querySelector('.dot').style.setProperty('--c', photo.story.color);
    tt.querySelector('.tt-story-name').textContent = photo.story.title;
    tt.querySelector('.tt-title').textContent = photo.description;
    tt.querySelector('.tt-meta').textContent = kind === 'umbrella'
      ? '照片对应的纸伞 · 点击查看照片'
      : '点击查看原图';
    tip.photo = photo; tip.kind = kind;
    tip.w = tt.offsetWidth; tip.h = tt.offsetHeight;
    tip.x = tip.y = null;
  }
  let x = pointer.x + 16, y = pointer.y + 18;
  if (x + tip.w > window.innerWidth - 8) x = pointer.x - tip.w - 16;
  if (y + tip.h > window.innerHeight - 8) y = pointer.y - tip.h - 18;
  x = Math.round(x); y = Math.round(y);
  if (x === tip.x && y === tip.y) return;
  tip.x = x; tip.y = y;
  tt.style.transform = `translate(${x}px, ${y}px)`;
}
function hideTooltip() {
  const tt = tip.el ||= $('#tooltip');
  if (!tt.hidden) tt.hidden = true;
}
function hideTooltipIfDragging() { if (pointer.dragging) hideTooltip(); }

// ---------------------------------------------------------------------------
function bindUI() {
  $('#btn-rotate').addEventListener('click', () => setRotation(!autoRotateAllowed));
  $('#btn-direction').addEventListener('click', () => { rotationDirection *= -1; syncRotationSpeed(); });
  $('#btn-speed').addEventListener('click', () => { rotationSpeed = rotationSpeed % 3 + 1; syncRotationSpeed(); });
  $('#btn-whole').addEventListener('click', () => goWhole());
  $('#btn-index').addEventListener('click', openIndex);
  $('#index-close').addEventListener('click', closeIndex);
  $('#index').addEventListener('click', (e) => { if (e.target.id === 'index') closeIndex(); });
  $('#d-close').addEventListener('click', () => stepBack());
  $('#d-prev').addEventListener('click', () => stepPhoto(-1));
  $('#d-next').addEventListener('click', () => stepPhoto(1));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if(state.mode==='whole'&&$('#index').hidden&&parent!==window)parent.postMessage({type:'canopy:close'},'*');
      else stepBack();
      return;
    }
    if (!$('#index').hidden) return;
    if (state.mode === 'photo' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      stepPhoto(e.key === 'ArrowRight' ? 1 : -1);
    }
  });
  window.addEventListener('hashchange', () => applyHash());
}

// ---------------------------------------------------------------------------
// Deep links: #story/<id> and #photo/<id>
// ---------------------------------------------------------------------------
let settingHash = false;
function setHash(h) {
  if(location.protocol==='about:')return; // srcdoc cannot replace history with a relative URL.
  settingHash = true;
  const url = h ? `#${h}` : location.pathname + location.search;
  history.replaceState(null, '', url);
  settingHash = false;
}
function applyHash() {
  if (settingHash) return false;
  const m = /^#(story|photo)\/(.+)$/.exec(location.hash);
  if (!m) return false;
  if (m[1] === 'story') {
    const s = state.stories.find((x) => x.id === m[2]);
    if (s) { selectStory(s); return true; }
  } else {
    const p = state.photos.find((x) => x.id === m[2]);
    if (p) { openPhoto(p); return true; }
  }
  return false;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------------------------------------------------------------------------
// Small hook for automated checks (screenshots, fps).
// ---------------------------------------------------------------------------
window.canopy = {
  ready,
  get scene() { return scene; },
  state,
  whole: () => goWhole(),
  story: (id) => selectStory(state.stories.find((s) => s.id === id)),
  photo: (id) => openPhoto(state.photos.find((p) => p.id === id)),
  screenPos: (id) => scene.screenPosition(state.photos.find((p) => p.id === id)),
  setAutoRotate: setRotation,
  isFlying: () => !!scene.flight,
  stats: () => scene.stats(),
  fps: (ms = 3000) => new Promise((resolve) => {
    let n = 0; const t0 = performance.now();
    const tick = () => { n++; if (performance.now() - t0 < ms) requestAnimationFrame(tick); else resolve(Math.round((n / (performance.now() - t0)) * 10000) / 10); };
    requestAnimationFrame(tick);
  }),
};

init();

