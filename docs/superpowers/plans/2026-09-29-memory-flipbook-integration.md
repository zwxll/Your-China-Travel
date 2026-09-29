# Memory Flipbook Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current hand-built city-album page transition with a responsive PageFlip reader while preserving the existing 3D province shelf, chapter navigation, editing, data, and photo viewer.

**Architecture:** Keep `memoryShelfState` and all persistence in `index.html`. Add a small `window.MemoryFlipbook` adapter around the vendored PageFlip runtime; `index.html` builds book-page DOM from the current city and photo arrays, while the adapter owns only PageFlip creation, navigation, responsive mode, focus visibility, and destruction.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, StPageFlip browser runtime, Node.js built-in test runner, Playwright using the repository's existing bundled runtime.

**Spec:** `docs/superpowers/specs/2026-09-29-memory-flipbook-integration-design.md`

## Global Constraints

- Preserve the existing province shelf, WebGL/DOM fallback, 3D selection, covers, province editing, and persistence behavior.
- `memoryShelfState` remains the only application state source; the flipbook adapter must not persist or copy travel data.
- Do not add a package manager, build tool, or remote CDN.
- Do not invent dates, locations, itineraries, captions, or travel prose; use blank space or the exact missing-data copy from the spec.
- Keep the current photo viewer and city-detail entry working.
- Do not modify unrelated header, map, city-card, timeline, profile, Supabase, IndexedDB, or OSS code.
- Do not retain drag-to-adjust photo cropping inside the flipbook; dragging is reserved for turning pages.

## Review Focus

- A city with zero photos must still render an intro and closing page, with navigation boundaries disabled.
- Missing visit date and description must render `时间尚未记录` and `城市简介尚未记录`, never synthesized content.
- Reopening the same city or switching cities must destroy the previous PageFlip instance and must not duplicate event handlers.
- On a narrow viewport the reader must use single-page mode without clipping navigation or trapping focus in hidden pages.
- A broken image must preserve page dimensions, expose `影像暂无法加载`, and leave the rest of the book navigable.

---

## File Map

- Create `assets/memory-flipbook/memory-flipbook.css`: reader-specific paper, cloth, page-layout, control, responsive, and reduced-motion styles.
- Create `assets/memory-flipbook/memory-flipbook.js`: minimal PageFlip adapter exposed as `window.MemoryFlipbook`.
- Create `assets/memory-flipbook/paper-grain.svg` and `cloth-weave.svg`: copied unchanged from the installed skill.
- Create `assets/memory-flipbook/fonts/SourceSerif4-Regular.otf.woff2` and `SourceSerif4-It.otf.woff2`: copied unchanged with their license/source notices.
- Create `assets/memory-flipbook/vendor/page-flip.browser.js` and `PAGE-FLIP-LICENSE`: copied unchanged from the installed skill.
- Modify `index.html`: load the local assets, restyle chapter pages, build city-book pages, and manage reader lifecycle.
- Create `tests/memory-flipbook-assets.test.cjs`: structural and adapter-contract checks.
- Create `tests/memory-flipbook.spec.cjs`: end-to-end shelf, chapter, album, responsive, missing-data, image-error, and cleanup checks.

### Task 1: Vendor the Local Runtime and Lock Its Public Contract

**Files:**
- Create: `assets/memory-flipbook/vendor/page-flip.browser.js`
- Create: `assets/memory-flipbook/vendor/PAGE-FLIP-LICENSE`
- Create: `assets/memory-flipbook/paper-grain.svg`
- Create: `assets/memory-flipbook/cloth-weave.svg`
- Create: `assets/memory-flipbook/fonts/SourceSerif4-Regular.otf.woff2`
- Create: `assets/memory-flipbook/fonts/SourceSerif4-It.otf.woff2`
- Create: `assets/memory-flipbook/fonts/LICENSE.md`
- Create: `assets/memory-flipbook/fonts/SOURCE.txt`
- Create: `assets/memory-flipbook/memory-flipbook.js`
- Test: `tests/memory-flipbook-assets.test.cjs`

**Interfaces:**
- Consumes: `window.St.PageFlip` from `vendor/page-flip.browser.js`.
- Produces: `window.MemoryFlipbook.create(options)` returning `{ next(), prev(), turnTo(index), getPageIndex(), destroy() }`.
- `options`: `{ root: HTMLElement, initialPage: number, mobileBreakpoint: number, reduceMotion: boolean, onFlip(index: number): void }`.

- [ ] **Step 1: Write the failing structural contract test**

Add Node assertions that every required local asset exists, the vendor license is non-empty, `memory-flipbook.js` contains no `http://` or `https://`, and evaluation in a VM with a fake `window` exposes `MemoryFlipbook.create`.

- [ ] **Step 2: Run the structural test and verify it fails**

Run: `node --test tests/memory-flipbook-assets.test.cjs`

Expected: FAIL because the memory-flipbook asset directory and adapter do not exist.

- [ ] **Step 3: Copy the immutable runtime assets from the installed skill**

Copy the matching files from `C:/Users/86177/.codex/skills/create-photo-flipbook-ui/assets/html/` without editing their contents. Do not copy the skill's sample `index.html`, `styles.css`, or `flipbook.js`.

- [ ] **Step 4: Implement the minimal adapter contract**

Implement `MemoryFlipbook.create(options)` so it initializes one PageFlip instance from `.book-page` children, uses portrait mode below `mobileBreakpoint`, forwards flip indices to `onFlip`, guards boundary navigation, and makes `destroy()` idempotent.

- [ ] **Step 5: Run the structural test and verify it passes**

Run: `node --test tests/memory-flipbook-assets.test.cjs`

Expected: PASS with all required files local and the adapter contract exposed.

- [ ] **Step 6: Commit the runtime boundary**

```bash
git add assets/memory-flipbook tests/memory-flipbook-assets.test.cjs
git commit -m "feat: add local memory flipbook runtime"
```

### Task 2: Add the Photobook Visual System and Runtime Fixture Tests

**Files:**
- Create: `assets/memory-flipbook/memory-flipbook.css`
- Modify: `assets/memory-flipbook/memory-flipbook.js`
- Modify: `tests/memory-flipbook-assets.test.cjs`

**Interfaces:**
- Consumes: the `MemoryFlipbook.create(options)` contract from Task 1.
- Produces: CSS classes `.memory-flipbook-root`, `.book-page`, `.memory-fb-intro`, `.memory-fb-photo`, `.memory-fb-ending`, `.memory-fb-image-error`, and adapter method `refreshLayout()`.

- [ ] **Step 1: Extend the failing test for visual and lifecycle requirements**

Assert the stylesheet defines local Source Serif font faces, paper and cloth texture URLs, desktop spread styles, a `max-width: 760px` single-page layout, visible `:focus-visible`, and `prefers-reduced-motion`. Assert the adapter controller includes `refreshLayout()` and repeated `destroy()` does not throw under a stub PageFlip implementation.

- [ ] **Step 2: Run the test and verify the new assertions fail**

Run: `node --test tests/memory-flipbook-assets.test.cjs`

Expected: FAIL for the missing stylesheet, responsive rules, or controller behavior.

- [ ] **Step 3: Implement the smallest coherent photobook stylesheet**

Use warm paper, restrained cloth, ink-blue text, small ceramic-brown accents, Chinese serif fallbacks, stable page dimensions, explicit image-error layout, and controls that remain outside the page-turn gesture surface.

- [ ] **Step 4: Add `refreshLayout()` and idempotent cleanup**

Have `refreshLayout()` update the PageFlip size/orientation after viewport changes. `destroy()` must remove adapter-owned listeners before destroying the PageFlip instance.

- [ ] **Step 5: Run the contract test and verify it passes**

Run: `node --test tests/memory-flipbook-assets.test.cjs`

Expected: PASS.

- [ ] **Step 6: Commit the reusable visual runtime**

```bash
git add assets/memory-flipbook tests/memory-flipbook-assets.test.cjs
git commit -m "feat: style the memory flipbook reader"
```

### Task 3: Integrate the Reader with Existing Memory Shelf State

**Files:**
- Modify: `index.html:4874-5058`
- Modify: `index.html:5290-5304`
- Modify: `index.html:6268-6300`
- Modify: `index.html:17120-17126`
- Modify: `index.html:17655-17915`
- Create: `tests/memory-flipbook.spec.cjs`

**Interfaces:**
- Consumes: `MemoryFlipbook.create(options)` and the existing `memoryShelfState`, `getPhotosByCity`, `openPhotoViewer`, `memoryOpenChapters`, and `memoryOpenAlbum` flows.
- Produces: `memoryBuildFlipbookPages(city, photos)`, `memoryMountAlbumFlipbook()`, and `memoryDestroyAlbumFlipbook()` inside the existing application script.

- [ ] **Step 1: Write the failing end-to-end happy-path test**

Seed IndexedDB with one province/city, a real description/date, and three tiny data-URL images. Open the memory shelf, open the active province book, select the city, and assert that `.memory-flipbook-root` exists, the title/date/description are source values, the counter changes after clicking Next, Previous returns it, a photo opens the existing viewer, and Back returns to the chapter page.

- [ ] **Step 2: Run the happy-path test and verify it fails**

Run: `node tests/memory-flipbook.spec.cjs`

Expected: FAIL because the current album uses `.memory-album-book` and no `MemoryFlipbook` instance.

- [ ] **Step 3: Load the local runtime and stylesheet in `index.html`**

Add one local stylesheet link before `</head>`, load the vendor script before `memory-flipbook.js`, and load both before the application script uses `MemoryFlipbook`. Do not move unrelated scripts.

- [ ] **Step 4: Implement page construction from existing state**

`memoryBuildFlipbookPages(city, photos)` returns page markup in this exact order: intro, source-ordered photo pages, ending. Use existing values only; missing date and description use the spec's exact copy. Add `data-density="hard"` only to first and last leaves. Photo buttons keep their original photo index for `openPhotoViewer`.

- [ ] **Step 5: Replace the city-album mount and navigation path**

Keep the existing toolbar, Back, City Detail, Prev, Next, and counter elements. Replace `memoryRenderAlbumSpread()`/`memoryTurnAlbum()` usage in `memoryOpenAlbum()` with `memoryMountAlbumFlipbook()`, wire controller flips back to `memoryShelfState.page`, and stop binding crop-adjust drag handlers inside the new reader.

- [ ] **Step 6: Add lifecycle cleanup at every exit**

Call `memoryDestroyAlbumFlipbook()` before opening another city, before returning to chapters, inside `closeMemoryShelf()`, and before rerendering an album. Store only the controller reference in a dedicated local variable, not in persisted data.

- [ ] **Step 7: Restyle the chapter spread without changing its behavior**

Adjust only chapter-related selectors so the province title page and city directory use the new paper, typography, spacing, and focus treatment. Preserve hover/focus cover preview and city click handlers.

- [ ] **Step 8: Run the happy-path test and existing regression test**

Run:

```bash
node tests/memory-flipbook.spec.cjs
node tests/local-folder.spec.cjs
```

Expected: both exit 0 and print their PASS lines.

- [ ] **Step 9: Commit the direct integration**

```bash
git add index.html tests/memory-flipbook.spec.cjs
git commit -m "feat: integrate flipbook into memory shelf"
```

### Task 4: Pin Missing Data, Errors, Responsive Mode, and Cleanup

**Files:**
- Modify: `tests/memory-flipbook.spec.cjs`
- Modify: `assets/memory-flipbook/memory-flipbook.css`
- Modify: `assets/memory-flipbook/memory-flipbook.js`
- Modify: `index.html:17655-17915`

**Interfaces:**
- Consumes: all Task 3 integration interfaces.
- Produces: verified behavior for the five Review Focus cases and final responsive reader behavior.

- [ ] **Step 1: Add failing cases for missing and broken content**

Add scenarios for zero photos, missing date/description, and one broken image. Assert the exact missing-data copy, a stable page container with `影像暂无法加载`, disabled boundary controls, and no console error that breaks navigation.

- [ ] **Step 2: Add failing lifecycle and responsive cases**

Open/close the same album twice and switch cities; assert exactly one live reader root and one counter update per turn. Repeat at a 390×844 viewport; assert portrait mode, usable toolbar controls, no horizontal page overflow, and hidden pages absent from the Tab order.

- [ ] **Step 3: Run the new cases and verify they fail for the expected gaps**

Run: `node tests/memory-flipbook.spec.cjs`

Expected: FAIL only on unimplemented missing-data, error, cleanup, or responsive assertions.

- [ ] **Step 4: Implement the minimal fixes for each failing case**

Keep changes inside the memory-flipbook assets and memory-shelf block. Add no generalized framework, global error handler, or unrelated responsive refactor.

- [ ] **Step 5: Run the complete automated suite**

Run:

```bash
node --test tests/memory-flipbook-assets.test.cjs
node tests/memory-flipbook.spec.cjs
node tests/local-folder.spec.cjs
```

Expected: all commands exit 0.

- [ ] **Step 6: Perform rendered visual verification**

Start the existing static server, inspect desktop and 390×844 screenshots, exercise mouse drag, touch emulation, ArrowLeft/ArrowRight, Prev/Next, Escape, City Detail, and photo viewer. Confirm the browser console has no relevant errors and compare the result against the approved warm-paper design.

- [ ] **Step 7: Verify surgical scope**

Run: `git diff --check` and `git diff --stat`.

Expected: only `index.html`, `assets/memory-flipbook/**`, and `tests/memory-flipbook*.cjs` are feature changes; existing unrelated `vercel.json` and user files remain untouched.

- [ ] **Step 8: Commit final verification fixes**

```bash
git add index.html assets/memory-flipbook tests/memory-flipbook-assets.test.cjs tests/memory-flipbook.spec.cjs
git commit -m "test: verify responsive memory flipbook"
```
