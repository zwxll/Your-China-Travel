const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function startServer() {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const requested = pathname === '/' ? 'index.html' : pathname.slice(1);
    const filePath = path.resolve(root, requested);
    if (!filePath.startsWith(root + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404).end('Not found');
      return;
    }
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function svgData(fill, label) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="${fill}"/><text x="450" y="320" text-anchor="middle" font-size="92" fill="white">${label}</text></svg>`)}`;
}

async function seedXiaogan(page) {
  const photos = [svgData('#7d9278', '一'), svgData('#b77a5b', '二'), svgData('#607f93', '三')];
  await page.evaluate(async dataUrls => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('TravelPhotosDB', 6);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction(['photos', 'cityMeta'], 'readwrite');
      const photoStore = tx.objectStore('photos');
      dataUrls.forEach((dataUrl, index) => photoStore.add({
        cityKey: '420900_孝感市', cityName: '孝感市', adcode: 420900,
        name: `孝感-${index + 1}.svg`, kind: 'image', dataUrl,
        timestamp: 1700000000000 + index, order: index + 1,
      }));
      tx.objectStore('cityMeta').put({
        cityKey: '420900_孝感市', visitMonth: '2025-04', visitMonths: ['2025-04'],
        description: '真实记录：春日抵达孝感。', tags: [], attractions: [],
      });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }, photos);
}

async function prepareEdgeCases(page) {
  await page.evaluate(async wuhanPhoto => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('TravelPhotosDB', 6);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction(['photos', 'cityMeta'], 'readwrite');
      const photos = tx.objectStore('photos');
      const byCity = photos.index('cityKey');
      const request = byCity.openCursor(IDBKeyRange.only('420900_孝感市'));
      let first = true;
      request.onsuccess = event => {
        const cursor = event.target.result;
        if (!cursor) return;
        if (first) {
          const photo = cursor.value;
          photo.dataUrl = 'data:image/png;base64,broken-image';
          cursor.update(photo);
          first = false;
        }
        cursor.continue();
      };
      photos.add({
        cityKey: '420100_武汉市', cityName: '武汉市', adcode: 420100,
        name: '武汉.svg', kind: 'image', dataUrl: wuhanPhoto,
        timestamp: 1800000000000, order: 1,
      });
      tx.objectStore('cityMeta').put({ cityKey: '420900_孝感市', visitMonth: '', visitMonths: [], description: '', tags: [], attractions: [] });
      tx.objectStore('cityMeta').put({ cityKey: '420100_武汉市', visitMonth: '2026-03', visitMonths: ['2026-03'], description: '', tags: [], attractions: [] });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }, svgData('#776b88', '武'));
}

async function deleteCityPhotos(page, cityKey) {
  await page.evaluate(async key => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('TravelPhotosDB', 6);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction('photos', 'readwrite');
      const request = tx.objectStore('photos').index('cityKey').openCursor(IDBKeyRange.only(key));
      request.onsuccess = event => {
        const cursor = event.target.result;
        if (!cursor) return;
        cursor.delete();
        cursor.continue();
      };
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }, cityKey);
}

async function run() {
  const server = await startServer();
  const { port } = server.address();
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const relevantErrors = [];
  page.on('pageerror', error => {
    if (/MemoryFlipbook|PageFlip|memory-fb/i.test(error.message)) relevantErrors.push(error.message);
  });

  try {
    await page.addInitScript(() => localStorage.setItem('travelStorageMode', 'local'));
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#memoryShelfBtn');
    await seedXiaogan(page);

    await page.evaluate(() => document.querySelector('#memoryShelfBtn').click());
    await page.waitForSelector('.memory-book');
    await page.evaluate(() => document.querySelector('.memory-book').click());
    await page.waitForSelector('[data-memory-city]');
    await page.click('[data-memory-city]');
    await page.waitForSelector('.memory-flipbook-root', { timeout: 10000 });

    const sourceValues = await page.evaluate(() => {
      const readerRect = document.querySelector('.memory-flipbook-root')?.getBoundingClientRect();
      const stageRect = document.querySelector('.memory-album-stage')?.getBoundingClientRect();
      const shellRect = document.querySelector('.memory-fb-shell')?.getBoundingClientRect();
      const reader = document.querySelector('.memory-flipbook-root');
      const readerStyle = reader && getComputedStyle(reader);
      return {
        title: document.querySelector('.memory-fb-title')?.textContent,
        date: document.querySelector('.memory-fb-meta')?.textContent,
        description: document.querySelector('.memory-fb-description')?.textContent,
        counter: document.querySelector('#memoryAlbumCounter')?.textContent,
        readerWidth: readerRect?.width,
        readerBottom: readerRect?.bottom,
        stageBottom: stageRect?.bottom,
        stageHeight: stageRect?.height,
        shellWidth: shellRect?.width,
        shellHeight: shellRect?.height,
        readerHeight: readerRect?.height,
        readerInlineStyle: reader?.getAttribute('style'),
        readerComputedWidth: readerStyle?.width,
        readerComputedHeight: readerStyle?.height,
      };
    });
    assert(sourceValues.title === '孝感市', `城市标题不正确：${sourceValues.title}`);
    assert(sourceValues.date.includes('2025年4月'), `日期未使用原始资料：${sourceValues.date}`);
    assert(sourceValues.description === '真实记录：春日抵达孝感。', `简介未使用原始资料：${sourceValues.description}`);
    assert(sourceValues.readerWidth >= 800, `桌面双页阅读器过窄：${sourceValues.readerWidth}`);
    assert(sourceValues.readerBottom <= sourceValues.stageBottom + 1, `桌面书页超出阅读区：${JSON.stringify(sourceValues)}`);
    if (process.env.MEMORY_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.MEMORY_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: path.join(process.env.MEMORY_SCREENSHOT_DIR, 'desktop-reader.png') });
    }

    await page.click('#memoryAlbumNext');
    await page.waitForFunction(previous => document.querySelector('#memoryAlbumCounter')?.textContent !== previous, sourceValues.counter);
    const nextCounter = await page.textContent('#memoryAlbumCounter');
    assert(nextCounter !== sourceValues.counter, '下一页没有更新计数器');
    await page.click('#memoryAlbumPrev');
    await page.waitForFunction(expected => document.querySelector('#memoryAlbumCounter')?.textContent === expected, sourceValues.counter);

    await page.click('#memoryAlbumNext');
    await page.waitForTimeout(850);
    await page.click('[data-memory-photo="0"]');
    await page.waitForSelector('.img-viewer.stack-mode.show');
    await page.evaluate(() => window.__imgViewer.close());

    await page.click('#memoryBackChapters');
    await page.waitForSelector('.memory-chapter-book');
    assert(await page.locator('[data-memory-city]').count() === 1, '返回后城市章节未保留');
    console.log('PASS memory flipbook happy path');

    await prepareEdgeCases(page);
    await page.click('#memoryShelfClose');
    await page.evaluate(() => document.querySelector('#memoryShelfBtn').click());
    await page.waitForSelector('.memory-book');
    await page.evaluate(() => document.querySelector('.memory-book').click());
    await page.waitForSelector('[data-memory-city]');

    await page.locator('[data-memory-city]').filter({ hasText: '孝感市' }).click();
    await page.waitForSelector('.memory-flipbook-root');
    const missingCopy = await page.evaluate(() => ({
      date: document.querySelector('.memory-fb-meta')?.textContent || '',
      description: document.querySelector('.memory-fb-description')?.textContent || '',
    }));
    assert(missingCopy.date.includes('时间尚未记录'), `缺失日期文案不正确：${missingCopy.date}`);
    assert(missingCopy.description === '城市简介尚未记录', `缺失简介文案不正确：${missingCopy.description}`);
    await page.click('#memoryAlbumNext');
    await page.waitForTimeout(850);
    await page.waitForSelector('.memory-fb-image-error:not([hidden])');
    const brokenRect = await page.locator('.memory-fb-image-error:not([hidden])').locator('xpath=ancestor::section[1]').boundingBox();
    assert(brokenRect && brokenRect.width > 100 && brokenRect.height > 100, '损坏图片没有保留书页尺寸');
    const brokenPageCounter = await page.textContent('#memoryAlbumCounter');
    await page.click('#memoryAlbumNext');
    await page.waitForFunction(previous => document.querySelector('#memoryAlbumCounter')?.textContent !== previous, brokenPageCounter);
    assert(relevantErrors.length === 0, `翻页运行时出现错误：${relevantErrors.join('; ')}`);

    await page.click('#memoryBackChapters');
    await page.locator('[data-memory-city]').filter({ hasText: '孝感市' }).click();
    await page.waitForSelector('.memory-flipbook-root');
    assert(await page.locator('.memory-flipbook-root').count() === 1, '重复打开产生了多个阅读器');
    const reopenCounter = await page.textContent('#memoryAlbumCounter');
    await page.click('#memoryAlbumNext');
    await page.waitForFunction(previous => document.querySelector('#memoryAlbumCounter')?.textContent !== previous, reopenCounter);
    assert(await page.textContent('#memoryAlbumCounter') === '2 / 5', '一次翻页触发了重复计数更新');

    await page.click('#memoryBackChapters');
    await deleteCityPhotos(page, '420100_武汉市');
    await page.locator('[data-memory-city]').filter({ hasText: '武汉市' }).click();
    await page.waitForSelector('.memory-flipbook-root');
    assert(await page.textContent('#memoryAlbumCounter') === '1 / 2', '零照片城市未保留首尾页');
    assert(await page.isDisabled('#memoryAlbumPrev'), '零照片城市首页未禁用上一页');
    assert(!(await page.isDisabled('#memoryAlbumNext')), '零照片城市首页错误禁用了下一页');
    await page.click('#memoryAlbumNext');
    await page.waitForFunction(() => document.querySelector('#memoryAlbumCounter')?.textContent === '2 / 2');
    assert(await page.isDisabled('#memoryAlbumNext'), '零照片城市末页未禁用下一页');

    await page.click('#memoryBackChapters');
    await page.locator('[data-memory-city]').filter({ hasText: '孝感市' }).click();
    await page.waitForSelector('.memory-flipbook-root');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await page.waitForFunction(() => document.querySelector('.memory-flipbook-root')?.dataset.layout === 'portrait');
    const mobile = await page.evaluate(() => {
      const root = document.querySelector('.memory-flipbook-root');
      const rect = root.getBoundingClientRect();
      const visibleControls = ['memoryBackChapters', 'memoryAlbumPrev', 'memoryAlbumNext'].every(id => {
        const control = document.getElementById(id);
        const box = control.getBoundingClientRect();
        return box.width > 0 && box.height > 0;
      });
      const hiddenPagesUntabbable = [...root.querySelectorAll('.book-page')].every((page, index) =>
        index === 0 || [...page.querySelectorAll('button, a, input, select, textarea, [tabindex]')].every(item => item.tabIndex === -1)
      );
      return { layout: root.dataset.layout, left: rect.left, right: rect.right, visibleControls, hiddenPagesUntabbable };
    });
    assert(mobile.layout === 'portrait', `手机未进入单页模式：${mobile.layout}`);
    assert(mobile.left >= -1 && mobile.right <= 391, `手机书页横向溢出：${JSON.stringify(mobile)}`);
    assert(mobile.visibleControls, '手机工具栏控件不可用');
    assert(mobile.hiddenPagesUntabbable, '隐藏书页仍进入 Tab 顺序');
    if (process.env.MEMORY_SCREENSHOT_DIR) {
      await page.screenshot({ path: path.join(process.env.MEMORY_SCREENSHOT_DIR, 'mobile-reader.png') });
    }

    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('#memoryAlbumCounter')?.textContent === '2 / 5');
    await page.keyboard.press('ArrowLeft');
    await page.waitForFunction(() => document.querySelector('#memoryAlbumCounter')?.textContent === '1 / 5');
    await page.keyboard.press('Escape');
    await page.waitForSelector('.memory-chapter-book');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('[data-memory-city]').filter({ hasText: '孝感市' }).click();
    await page.waitForSelector('.memory-flipbook-root');
    const dragBox = await page.locator('.memory-flipbook-root').boundingBox();
    await page.mouse.move(dragBox.x + dragBox.width - 10, dragBox.y + dragBox.height * .72);
    await page.mouse.down();
    await page.mouse.move(dragBox.x + dragBox.width * .18, dragBox.y + dragBox.height * .72, { steps: 14 });
    await page.mouse.up();
    await page.waitForFunction(() => document.querySelector('#memoryAlbumCounter')?.textContent !== '1 / 5');

    await page.click('#memoryAlbumPrev');
    await page.waitForFunction(() => document.querySelector('#memoryAlbumCounter')?.textContent === '1 / 5');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    const touchBox = await page.locator('.memory-flipbook-root').boundingBox();
    const cdp = await context.newCDPSession(page);
    const y = touchBox.y + touchBox.height * .7;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchBox.x + touchBox.width - 10, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchBox.x + touchBox.width * .18, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForFunction(() => document.querySelector('#memoryAlbumCounter')?.textContent !== '1 / 5');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.click('#memoryCityDetail');
    await page.waitForSelector('#attDetailOverlay.show');
    await page.click('#attDetailCloseBtn');
    console.log('PASS memory flipbook edge cases and responsive mode');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

run().catch(error => {
  console.error(`FAIL memory flipbook: ${error.stack || error.message}`);
  process.exitCode = 1;
});
