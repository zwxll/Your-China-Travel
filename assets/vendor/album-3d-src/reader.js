// Parameterized 3D flipbook reader for the city photo album.
// Adapted from HaichaoLihc/create-photo-flipbook-ui ui-collections/3d-book-2
// (src/main.js + src/drag.js, MIT). Differences from the demo:
// - hosts the canvas inside a caller-supplied container (not fullscreen)
// - pages arrive as pre-drawn canvases (app paints the photobook paper style)
// - tap on a photo reports onPhotoTap instead of turning the page
// - long-press / immediate drag on a photo reports frame-adjust deltas
// - keyboard/wheel stay with the caller; stage colors follow site theme
// - no library rail, no loading card (app owns those)
import * as THREE from "three";
import { FlipBook } from "quick_flipbook";
import {
  chooseDragDirection,
  dragFraction,
  edgePreviewDirection,
  edgePreviewPose,
  isActivePointer,
  isPointerOverBook,
  shouldCompleteDrag,
} from "./drag.js";

const MAX_PIXEL_RATIO = 1.5;
const SHADOW_MAP_SIZE = 1024;
const PAGE_SUBDIVISIONS = 16;
const MAX_TEXTURE_ANISOTROPY = 4;
const LONG_PRESS_MS = 180;
const FRAME_ADJUST_THRESHOLD = 6;

const DEFAULT_THEME = {
  shadowOpacity: 0.18,
  hemiSky: "#ffffff",
  hemiGround: "#e9e9e6",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createAlbum3DReader({
  container,
  ratio,
  theme = DEFAULT_THEME,
  reducedMotion = false,
  onStatus = () => {},
  onPhotoTap = () => {},
  onPhotoFrameStart = () => {},
  onPhotoFrameMove = () => {},
  onPhotoFrameEnd = () => {},
}) {
  const canvas = document.createElement("canvas");
  canvas.className = "memory-album-3d-canvas";
  container.appendChild(canvas);

  const flipDuration = reducedMotion ? 0.001 : 0.78;
  // 画布保持透明：书本直接浮在相册自身的背景上，只渲染柔和投影，
  // 避免 WebGL 舞台在页面上形成一块灰色矩形。
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
  camera.position.set(0, 5, 0);
  camera.up.set(0, 0, -1);
  camera.lookAt(0, 0, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (error) {
    canvas.remove();
    throw error;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // 不做色调映射：书页贴图按原始 CSS 颜色绘制，光照总量已校准为
  // 受光面 ≈ π，使纸面呈现与 DOM 相册一致的 #f3eee4 原色，照片原样显示。
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const hemiLight = new THREE.HemisphereLight(theme.hemiSky, theme.hemiGround, 0.9);
  scene.add(hemiLight);

  // 主光几乎纯侧向（Z 分量趋零）：翻起书页的投影完全落在书本右侧，
  // 上翻分量 ≤1% 书高；强度按新入射角校准，使受光面总辐照仍≈π（纸色不变）。
  const keyLight = new THREE.DirectionalLight("#ffffff", 2.68);
  keyLight.position.set(-3.4, 5.6, 0.06);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 14;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  // 薄纸双面很接近，增加偏移避免阴影在纸面与照片上形成密集斑纹。
  keyLight.shadow.bias = -0.0015;
  keyLight.shadow.normalBias = 0.02;
  // 半径加大让投影边缘更柔,翻起书页的影子不会在右页上留下生硬的暗带
  keyLight.shadow.radius = 6;
  scene.add(keyLight);

  const rimLight = new THREE.PointLight("#ffffff", 0.45, 8, 2);
  rimLight.position.set(2.5, 1.8, -2.4);
  scene.add(rimLight);

  const floorMaterial = new THREE.ShadowMaterial({ opacity: theme.shadowOpacity ?? 0.18 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.035;
  floor.receiveShadow = true;
  scene.add(floor);

  const bookRig = new THREE.Group();
  scene.add(bookRig);

  const flipBook = new FlipBook({
    flipDuration,
    yBetweenPages: 0.0012,
    pageSubdivisions: PAGE_SUBDIVISIONS,
  });
  flipBook.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  bookRig.add(flipBook);

  let pageRatio = ratio;
  let pages = [];
  let materials = [];
  let ready = false;
  let disposed = false;
  let lastStatusKey = "";
  let settledPage = 0;
  let pointerStart = null;
  const EDGE_PREVIEW_AMOUNT = 0.055;
  const EDGE_PREVIEW_ZONE = 28;
  const EDGE_PREVIEW_EPSILON = 0.0005;
  const edgePreview = { baseSheet: null, direction: 0, amount: 0, target: 0 };
  const memoizedSheets = new WeakSet();
  const dirtySheets = new Set();
  let animationFrame = null;
  let previousFrameTime = performance.now();
  let resizeObserver = null;
  // 临时诊断：只保留最近输入与模型姿态，不记录照片或用户资料。
  const turnTrace = [];
  function recordInput(input) {
    turnTrace.push({ time: performance.now(), ...input, progress: flipBook.progress,
      target: flipBook.currentPage, pointer: pointerStart ? { dragging: pointerStart.dragging, framing: pointerStart.framing } : null });
    if (turnTrace.length > 360) turnTrace.shift();
  }

  function makePaperMaterial(map = null) {
    const material = new THREE.MeshStandardMaterial({
      color: map ? "#ffffff" : "#f4efe4",
      map,
      roughness: 0.88,
      metalness: 0,
      toneMapped: true,
    });
    material.shadowSide = THREE.DoubleSide;
    return material;
  }

  function textureFromCanvas(source) {
    const texture = new THREE.CanvasTexture(source);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(
      MAX_TEXTURE_ANISOTROPY,
      renderer.capabilities.getMaxAnisotropy(),
    );
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  function disposeMaterials() {
    for (const material of materials) {
      if (!material || material === blankMaterial) continue;
      material.map?.dispose();
      material.dispose();
    }
    materials = [];
  }

  const blankMaterial = makePaperMaterial();

  function memoizeSheetDeformation() {
    for (const sheet of flipBook) {
      if (memoizedSheets.has(sheet)) continue;
      const flip = sheet.flip.bind(sheet);
      let previousPageProgress = Number.NaN;
      let previousDirection = Number.NaN;
      let previousCurveIntensity = Number.NaN;
      sheet.flip = (pageProgress, direction, curveIntensity = 1) => {
        // 全局方向和曲率会随下一张纸变化，不应让已经静止的纸页再次起伏。
        // 完全合上时仍须执行曲率归零，否则内页残留弯曲会穿过封面/封底。
        const flattenClosedBook = curveIntensity === 0 && previousCurveIntensity !== 0;
        if (pageProgress === previousPageProgress && (pageProgress === 0 || pageProgress === 1) && !flattenClosedBook) return;
        if (
          pageProgress === previousPageProgress
          && direction === previousDirection
          && curveIntensity === previousCurveIntensity
        ) return;
        previousPageProgress = pageProgress;
        previousDirection = direction;
        previousCurveIntensity = curveIntensity;
        flip(pageProgress, direction, curveIntensity);
        dirtySheets.add(sheet);
      };
      memoizedSheets.add(sheet);
    }
  }

  function refreshAllPageNormals() {
    for (const sheet of flipBook) sheet.page.geometry.computeVertexNormals();
    dirtySheets.clear();
  }

  function refreshDirtyPageNormals() {
    for (const sheet of dirtySheets) sheet.page.geometry.computeVertexNormals();
    dirtySheets.clear();
  }

  async function setPages(nextPages) {
    if (disposed) return;
    disposeMaterials();
    pages = nextPages.slice();
    materials = pages.map((page) => {
      if (!page || !page.canvas) return blankMaterial;
      return makePaperMaterial(textureFromCanvas(page.canvas));
    });
    flipBook.scale.x = pageRatio;
    flipBook.setPages(materials);
    memoizeSheetDeformation();
    // 收敛翻页越界：引擎 FlipPage 的 twist 绕页面宽度轴扭转，会把自由边
    // 一角沿屏幕竖向抬起约 5-7% 书高（上缘翘出书顶的主因），隆起参数只占
    // 小头。这里把 twist 角限幅到原值 40%（姿态保留、翘出降到 2-3%），
    // 并把隆起参数压到 0.006；修改器栈仍引用真实 twist 对象，仅拦截赋值。
    for (const sheet of flipBook) {
      if (sheet.pageCurve) sheet.pageCurve.elevationHeight = 0.006;
      if (sheet.twist) {
        const realTwist = sheet.twist;
        sheet.twist = {
          get angle() { return realTwist.angle; },
          set angle(value) { realTwist.angle = value * 0.4; },
          vector: realTwist.vector,
          center: realTwist.center,
        };
      }
    }
    flipBook.progress = 0;
    refreshAllPageNormals();
    // Quick FlipBook assigns supplied materials through an internal promise
    // chain. Drain those microtasks before making the album interactive.
    for (let index = 0; index < materials.length; index += 1) await Promise.resolve();
    if (disposed) return;
    flipBook.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    ready = true;
    lastStatusKey = "";
    updateStatus();
    requestRender();
  }

  function refreshPage(index, source) {
    if (disposed || !materials[index] || materials[index] === blankMaterial) return;
    const texture = textureFromCanvas(source);
    const material = materials[index];
    material.map?.dispose();
    material.map = texture;
    material.needsUpdate = true;
    requestRender();
  }

  function getBookScreenMetrics() {
    const bounds = canvas.getBoundingClientRect();
    const pixelsPerWorldUnit = bounds.width / Math.max(0.001, camera.right - camera.left);
    // 取景上下不对称（顶部预留翻页翘起空间），书本中心的屏幕位置
    // 必须按相机投影换算，不能直接取画布几何中心。
    const centerY = bounds.top + (camera.top - 0) / (camera.top - camera.bottom) * bounds.height;
    return {
      centerX: bounds.left + bounds.width / 2,
      centerY,
      pageWidth: pageRatio * pixelsPerWorldUnit,
      pageHeight: pixelsPerWorldUnit,
    };
  }

  function clearEdgePreview(immediate = false) {
    if (edgePreview.baseSheet === null) return;
    edgePreview.target = 0;
    if (!immediate) {
      requestRender();
      return;
    }
    flipBook.progress = edgePreview.baseSheet;
    edgePreview.baseSheet = null;
    edgePreview.direction = 0;
    edgePreview.amount = 0;
    requestRender();
  }

  function isAutoTurning() {
    return edgePreview.baseSheet === null
      && Math.abs(flipBook.progress - flipBook.currentPage / 2) > 1e-7;
  }

  function updateEdgePreview(event) {
    if (reducedMotion || !ready || pointerStart || isAutoTurning() || event.pointerType === "touch") return;

    const previewActive = edgePreview.baseSheet !== null;
    const sheet = previewActive ? edgePreview.baseSheet : Math.round(flipBook.progress);
    if (!previewActive && Math.abs(flipBook.progress - sheet) >= 0.001) return;

    const metrics = getBookScreenMetrics();
    const maxSheet = Math.ceil(flipBook.totalPages / 2);
    const direction = edgePreviewDirection({
      sheet,
      maxSheet,
      pointerX: event.clientX,
      pointerY: event.clientY,
      edgeZone: EDGE_PREVIEW_ZONE,
      ...metrics,
    });

    if (direction === 0) {
      clearEdgePreview();
      return;
    }
    if (previewActive && edgePreview.direction !== direction) clearEdgePreview(true);
    edgePreview.baseSheet = sheet;
    edgePreview.direction = direction;
    edgePreview.target = EDGE_PREVIEW_AMOUNT;
    requestRender();
  }

  function animateEdgePreview(delta) {
    if (edgePreview.baseSheet === null) return false;

    const easing = edgePreview.target > edgePreview.amount ? 18 : 14;
    const blend = 1 - Math.exp(-easing * delta);
    edgePreview.amount += (edgePreview.target - edgePreview.amount) * blend;

    if (Math.abs(edgePreview.target - edgePreview.amount) < EDGE_PREVIEW_EPSILON) {
      edgePreview.amount = edgePreview.target;
    }

    if (edgePreview.target === 0 && edgePreview.amount === 0) {
      flipBook.progress = edgePreview.baseSheet;
      edgePreview.baseSheet = null;
      edgePreview.direction = 0;
      edgePreview.amount = 0;
      return false;
    }

    const maxSheet = Math.ceil(flipBook.totalPages / 2);
    const pose = edgePreviewPose(
      edgePreview.baseSheet,
      edgePreview.direction,
      edgePreview.amount,
      maxSheet,
    );
    if (!pose) {
      clearEdgePreview(true);
      return false;
    }

    if (
      edgePreview.target > 0
      && edgePreview.amount === edgePreview.target
      && Math.abs(flipBook.progress - pose.progress) < EDGE_PREVIEW_EPSILON
    ) {
      if (flipBook.progress !== pose.progress) flipBook.progress = pose.progress;
      return false;
    }

    flipBook.progress = pose.progress;
    if (edgePreview.target === 0) {
      let sheetIndex = 0;
      for (const sheet of flipBook) {
        if (sheetIndex === pose.sheetIndex) {
          sheet.flip(pose.pageProgress, edgePreview.direction, pose.curveIntensity);
          break;
        }
        sheetIndex += 1;
      }
    }
    return edgePreview.amount !== edgePreview.target;
  }

  function takeEdgePreviewForDrag() {
    if (edgePreview.baseSheet === null || edgePreview.target === 0) return null;

    const preview = {
      sheet: edgePreview.baseSheet,
      direction: edgePreview.direction,
      fraction: edgePreview.amount,
    };
    edgePreview.baseSheet = null;
    edgePreview.direction = 0;
    edgePreview.amount = 0;
    edgePreview.target = 0;
    return preview;
  }

  function updateStatus() {
    if (!ready) return;
    const turning = isAutoTurning();
    if (!turning && !pointerStart?.dragging) {
      settledPage = edgePreview.baseSheet === null
        ? Math.round(flipBook.currentPage || 0)
        : edgePreview.baseSheet * 2;
    }
    const total = flipBook.totalPages || pages.length;
    const shown = Math.min(settledPage, total);
    const statusKey = `${shown}:${total}:${turning}`;
    if (statusKey === lastStatusKey) return;
    lastStatusKey = statusKey;
    if (shown <= 0) onStatus({ state: "cover", spread: 0, totalSpreads: Math.ceil(total / 2) - 1, turning });
    else if (shown >= total) onStatus({ state: "back", spread: Math.ceil(total / 2) - 1, totalSpreads: Math.ceil(total / 2) - 1, turning });
    else onStatus({ state: "spread", spread: Math.ceil(shown / 2), totalSpreads: Math.ceil(total / 2) - 1, turning });
  }

  function releaseButtonPreview() {
    // 仅交还动画控制权，不能先写 progress 把纸页回拨，再启动组件动画。
    edgePreview.baseSheet = null;
    edgePreview.direction = 0;
    edgePreview.amount = 0;
    edgePreview.target = 0;
  }

  function nextPage() {
    recordInput({ type: "next-command", blocked: !ready || isAutoTurning() });
    if (!ready || isAutoTurning() || flipBook.currentPage >= flipBook.totalPages) return;
    releaseButtonPreview();
    startProgrammaticTurn(1);
    updateStatus();
    requestRender();
  }

  function previousPage() {
    recordInput({ type: "previous-command", blocked: !ready || isAutoTurning() });
    if (!ready || isAutoTurning() || flipBook.currentPage <= 0) return;
    releaseButtonPreview();
    startProgrammaticTurn(-1);
    updateStatus();
    requestRender();
  }

  function startProgrammaticTurn(direction) {
    // 库的目标页 setter 会同步 flipPages：此时进度未推进，却已换了方向。
    // 只让它设置内部目标；首次姿态更新交给原有 animate，避免旧页先回弹。
    const flipPages = flipBook.flipPages;
    flipBook.flipPages = () => {};
    try {
      if (direction > 0) flipBook.nextPage();
      else flipBook.previousPage();
    } finally {
      flipBook.flipPages = flipPages;
    }
  }

  function visibleFacesAt(sheet) {
    // Settled at progress=sheet: left = sheet-1 back face, right = sheet front.
    return {
      left: sheet > 0 ? 2 * sheet - 1 : -1,
      right: sheet < Math.ceil(flipBook.totalPages / 2) ? 2 * sheet : -1,
    };
  }

  function photoAt(clientX, clientY) {
    if (!ready) return null;
    const sheet = Math.round(flipBook.progress);
    if (Math.abs(flipBook.progress - sheet) >= 0.001) return null;
    const faces = visibleFacesAt(sheet);
    if (faces.left < 0 && faces.right < 0) return null;
    const metrics = getBookScreenMetrics();
    const isLeft = clientX < metrics.centerX;
    const pageIndex = isLeft ? faces.left : faces.right;
    if (pageIndex < 0 || pageIndex >= pages.length) return null;
    const rects = pages[pageIndex]?.rects || [];
    if (!rects.length) return null;
    const pageLeft = isLeft ? metrics.centerX - metrics.pageWidth : metrics.centerX;
    const pageTop = metrics.centerY - metrics.pageHeight / 2;
    const u = (clientX - pageLeft) / metrics.pageWidth;
    const v = (clientY - pageTop) / metrics.pageHeight;
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    for (const rect of rects) {
      if (u >= rect.x && u <= rect.x + rect.w && v >= rect.y && v <= rect.y + rect.h) {
        return { pageIndex, photoIndex: rect.photoIndex, rect, u, v };
      }
    }
    return null;
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || !ready || disposed || isAutoTurning()) return;

    const preview = takeEdgePreviewForDrag();
    if (!preview) clearEdgePreview(true);
    const metrics = getBookScreenMetrics();
    const sheet = preview?.sheet ?? Math.round(flipBook.progress);
    const maxSheet = Math.ceil(flipBook.totalPages / 2);
    const settled = preview !== null || Math.abs(flipBook.progress - sheet) < 0.001;
    const overBook = isPointerOverBook({
      sheet,
      maxSheet,
      pointerX: event.clientX,
      pointerY: event.clientY,
      ...metrics,
    });

    pointerStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      sheet,
      maxSheet,
      pageWidth: metrics.pageWidth,
      direction: preview?.direction
        ?? chooseDragDirection(sheet, maxSheet, event.clientX, metrics.centerX),
      dragReady: settled && overBook,
      dragging: false,
      startFraction: preview?.fraction ?? 0,
      fraction: preview?.fraction ?? 0,
      pendingFraction: null,
      longPressTimer: null,
      framing: false,
      framePhoto: null,
      frameBaseX: event.clientX,
      frameBaseY: event.clientY,
    };

    // Photos take priority over page turns: plain tap opens the viewer and
    // press/drag adjusts framing, mirroring the previous DOM album behavior.
    if (settled) {
      const photo = photoAt(event.clientX, event.clientY);
      if (photo) {
        pointerStart.dragReady = false;
        pointerStart.framePhoto = photo;
        pointerStart.longPressTimer = setTimeout(() => {
          if (pointerStart !== null && !pointerStart.dragging) {
            pointerStart.framing = true;
            onPhotoFrameStart(pointerStart.framePhoto);
          }
        }, LONG_PRESS_MS);
      }
    }
    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    const start = pointerStart;
    // 未按下鼠标不能预改书页进度，否则按钮/滚轮会从旧页的半翻姿态启动。
    // pointerdown 后的真实拖页仍由下面原有逻辑处理。
    if (!start) return;
    if (start.pointerId !== event.pointerId || disposed) return;

    if (start.framePhoto && !start.framing && start.longPressTimer !== null) {
      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      if (moved > FRAME_ADJUST_THRESHOLD) {
        clearTimeout(start.longPressTimer);
        start.longPressTimer = null;
        start.framing = true;
        onPhotoFrameStart(start.framePhoto);
      }
    }
    if (start.framing) {
      event.preventDefault();
      const metrics = getBookScreenMetrics();
      onPhotoFrameMove({
        ...start.framePhoto,
        dx: event.clientX - start.frameBaseX,
        dy: event.clientY - start.frameBaseY,
        pageWidth: metrics.pageWidth,
        pageHeight: metrics.pageHeight,
      });
      return;
    }
    if (!start.dragReady || !ready) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (!start.dragging) {
      if (Math.abs(deltaX) < 6) return;
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
        start.dragReady = false;
        return;
      }
    }

    const fraction = dragFraction(
      deltaX,
      start.direction,
      start.pageWidth,
      start.startFraction,
    );
    if (!start.dragging && fraction === 0) return;

    start.dragging = true;
    start.fraction = fraction;
    start.pendingFraction = fraction;
    event.preventDefault();
    requestRender();
  });

  function finishFrameAdjust(commit) {
    const start = pointerStart;
    if (start.longPressTimer !== null) {
      clearTimeout(start.longPressTimer);
      start.longPressTimer = null;
    }
    if (!start.framing) return false;
    pointerStart = null;
    if (commit) onPhotoFrameEnd(start.framePhoto);
    return true;
  }

  canvas.addEventListener("pointerup", (event) => {
    const start = pointerStart;
    if (!isActivePointer(start, event.pointerId)) return;

    if (finishFrameAdjust(true)) {
      if (canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      return;
    }
    pointerStart = null;
    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    if (!ready) return;

    if (start.dragging) {
      start.fraction = dragFraction(
        event.clientX - start.x,
        start.direction,
        start.pageWidth,
        start.startFraction,
      );
      const elapsed = performance.now() - start.time;
      const complete = shouldCompleteDrag(start.fraction, elapsed);
      const targetSheet = start.sheet + (complete ? start.direction : 0);
      flipBook.currentPage = targetSheet * 2;
      requestRender();
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const elapsed = performance.now() - start.time;

    if (start.framePhoto) {
      // A press on a photo that never moved into framing is a viewer tap.
      if (elapsed < 500 && Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) {
        onPhotoTap(start.framePhoto);
      }
      return;
    }

    if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY)) {
      deltaX < 0 ? nextPage() : previousPage();
    } else if (elapsed < 500 && Math.abs(deltaY) < 20) {
      event.clientX < (canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width / 2)
        ? previousPage()
        : nextPage();
    } else if (start.startFraction > 0) {
      flipBook.currentPage = start.sheet * 2;
      requestRender();
    }
  });

  canvas.addEventListener("pointercancel", (event) => {
    if (!isActivePointer(pointerStart, event.pointerId)) return;

    finishFrameAdjust(false);
    flipBook.currentPage = pointerStart.sheet * 2;
    pointerStart = null;
    requestRender();
  });

  canvas.addEventListener("pointerleave", () => {
    if (!pointerStart) clearEdgePreview();
  });

  function resize() {
    if (disposed) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    const aspect = width / Math.max(1, height);
    const spreadWidth = pageRatio * 2;
    const padding = width < 620 ? 1.08 : 1.025;
    // 标题已在舞台外，仅保留翻页弯曲需要的边距，书页占舞台高度约 96%。
    const fitHeight = Math.max(1.04, (spreadWidth * padding) / aspect);
    camera.top = fitHeight * 0.51;
    camera.bottom = -fitHeight * 0.49;
    camera.left = -fitHeight * aspect / 2;
    camera.right = fitHeight * aspect / 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(width, height, false);
    camera.updateProjectionMatrix();
    requestRender();
  }

  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
  }
  window.addEventListener("resize", resize);
  resize();

  function applyDragFrame() {
    const start = pointerStart;
    if (!start?.dragging) return false;
    if (start.pendingFraction === null) return true;

    flipBook.progress = start.sheet + start.direction * start.pendingFraction;
    start.pendingFraction = null;
    return true;
  }

  function requestRender() {
    if (disposed || animationFrame !== null) return;
    previousFrameTime = performance.now();
    animationFrame = requestAnimationFrame(animate);
  }

  function continueRendering() {
    if (disposed || animationFrame === null) animationFrame = requestAnimationFrame(animate);
  }

  function animate() {
    animationFrame = null;
    // 启动和推进使用同一时钟。rAF 时间戳可能早于启动时的 now，不能送入负 dt。
    const now = performance.now();
    const delta = Math.max(0, Math.min((now - previousFrameTime) / 1000, 0.04));
    previousFrameTime = now;
    const previousProgress = flipBook.progress;
    const dragOwnsFrame = applyDragFrame();
    if (!dragOwnsFrame) flipBook.animate(delta);
    const previewNeedsFrame = animateEdgePreview(delta);
    refreshDirtyPageNormals();
    updateStatus();
    renderer.render(scene, camera);
    if (dragOwnsFrame || isAutoTurning() || previousProgress !== flipBook.progress) {
      recordInput({ type: "frame", delta, bookX: flipBook.position.x,
        angles: Array.from(flipBook, sheet => sheet.rotation.z),
        curves: Array.from(flipBook, sheet => [sheet.bend.force, sheet.twist.angle, sheet.pageCurve.intensity]) });
    }
    const progressChanged = Math.abs(previousProgress - flipBook.progress) > 1e-7;
    if (previewNeedsFrame || (!dragOwnsFrame && (progressChanged || isAutoTurning()))) continueRendering();
  }

  requestRender();

  return {
    setPages,
    refreshPage,
    nextPage,
    previousPage,
    resize,
    requestRender,
    isReady: () => ready,
    recordInput,
    getTurnDiagnostics: () => ({ build: "20261003-monotonic-clock", browser: navigator.userAgent,
      faces: pages.length, trace: turnTrace.slice() }),
    setTheme(nextTheme) {
      floorMaterial.opacity = nextTheme.shadowOpacity ?? 0.18;
      hemiLight.color = new THREE.Color(nextTheme.hemiSky ?? "#ffffff");
      hemiLight.groundColor = new THREE.Color(nextTheme.hemiGround ?? "#e9e9e6");
      requestRender();
    },
    dispose() {
      disposed = true;
      if (pointerStart?.longPressTimer !== null && pointerStart) {
        clearTimeout(pointerStart.longPressTimer);
      }
      pointerStart = null;
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      disposeMaterials();
      blankMaterial.dispose();
      flipBook.dispose();
      floor.geometry.dispose();
      floorMaterial.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
