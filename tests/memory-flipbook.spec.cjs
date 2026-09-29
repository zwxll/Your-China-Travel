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

async function run() {
  const server = await startServer();
  const { port } = server.address();
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

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

    const sourceValues = await page.evaluate(() => ({
      title: document.querySelector('.memory-fb-title')?.textContent,
      date: document.querySelector('.memory-fb-meta')?.textContent,
      description: document.querySelector('.memory-fb-description')?.textContent,
      counter: document.querySelector('#memoryAlbumCounter')?.textContent,
    }));
    assert(sourceValues.title === '孝感市', `城市标题不正确：${sourceValues.title}`);
    assert(sourceValues.date.includes('2025年4月'), `日期未使用原始资料：${sourceValues.date}`);
    assert(sourceValues.description === '真实记录：春日抵达孝感。', `简介未使用原始资料：${sourceValues.description}`);

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
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

run().catch(error => {
  console.error(`FAIL memory flipbook happy path: ${error.stack || error.message}`);
  process.exitCode = 1;
});
