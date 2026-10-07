// Read-only local photo preview. Personal photo screenshots stay in the temp folder.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const { pathToFileURL } = require('node:url');
const { chromium } = require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
(async () => {
  const source = path.join(root, '1/旅行资料');
  const catalog = JSON.parse(fs.readFileSync(path.join(source, 'index.json'), 'utf8'));
  const records = [];
  for (const city of catalog.cities) {
    const folder = path.join(source, city.year, city.cityName);
    const info = JSON.parse(fs.readFileSync(path.join(folder, 'info.json'), 'utf8'));
    for (const photo of info.photos || []) {
      if (photo.kind === 'video') continue;
      const file = path.join(folder, photo.file);
      const src = 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
      records.push({ id: info.cityKey + ':' + photo.file, cityKey: info.cityKey, title: city.cityName, year: Number(city.year), src, full: src });
    }
  }
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'tree-botanical-preview-'));
  fs.writeFileSync(path.join(folder, 'index.html'), '<meta charset="utf-8"><div id="stage" style="position:fixed;inset:0"></div>');
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1664, height: 1000 }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.join(folder, 'index.html')).href);
    // Keep original files untouched; only shrink preview images in memory.
    const thumbnails = await page.evaluate(async records => {
      for (const record of records) {
        const image = new Image(); image.src = record.src; await image.decode();
        record.aspect = image.naturalWidth / image.naturalHeight;
        const canvas = document.createElement('canvas'), scale = Math.min(1, 480 / Math.max(image.width, image.height));
        canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        record.src = record.full = canvas.toDataURL('image/jpeg', .8);
      }
      return records;
    }, records);
    await page.addScriptTag({ path: path.join(root, 'assets/travel-ring-tree/embedded.js') });
    await page.evaluate(records => {
      const frame = document.createElement('iframe'); frame.style.cssText = 'width:100%;height:100%;border:0';
      frame.srcdoc = TravelRingTreeDocument(records); document.querySelector('#stage').append(frame);
    }, thumbnails);
    const frame = page.frames().find(f => f !== page.mainFrame());
    await frame.waitForFunction(() => window.travelTree); await frame.evaluate(() => travelTree.ready);
    await frame.waitForFunction(() => travelTree.scene.cards.every(card => card.loaded), { timeout: 90000 });
    await frame.evaluate(() => { const s = travelTree.scene; s.setRunning(false); s.renderer.render(s.scene, s.camera); });
    await page.screenshot({ path: path.join(folder, 'overview.png'), timeout: 90000 });
    const metrics = await frame.evaluate(() => {
      const s = travelTree.scene; s.camera.position.set(24, 32, 36); s.controls.target.set(0, 22, 0); s.controls.update(); s.renderer.render(s.scene, s.camera);
      return { photos: s.cards.length, loaded: s.cards.filter(c => c.loaded).length, drawCalls: s.renderer.info.render.calls, triangles: s.renderer.info.render.triangles, shaders: s.renderer.info.programs.every(p => s.renderer.getContext().getProgramParameter(p.program, s.renderer.getContext().LINK_STATUS)) };
    });
    await page.screenshot({ path: path.join(folder, 'crown-closeup.png'), timeout: 90000 });
    await frame.evaluate(() => { const s = travelTree.scene; s.camera.position.set(24, 24, 40); s.controls.target.set(0, 22, 0); s.controls.update(); s.renderer.render(s.scene, s.camera); });
    await page.screenshot({ path: path.join(folder, 'crown-side.png'), timeout: 90000 });
    console.log(JSON.stringify({ folder, ...metrics, errors }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
