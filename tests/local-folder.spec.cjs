const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const videoFixture = path.join(root, '参考', '旅行资料', '未分类', '葫芦岛市', 'videos', '002-362.mp4');

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
    const ext = path.extname(filePath).toLowerCase();
    const type = ext === '.html' ? 'text/html; charset=utf-8'
      : ext === '.js' ? 'text/javascript; charset=utf-8'
      : ext === '.json' ? 'application/json; charset=utf-8'
      : ext === '.woff2' ? 'font/woff2'
      : ext === '.ttf' ? 'font/ttf'
      : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function readArchiveFile(page, name) {
  return page.evaluate(async fileName => {
    const rootHandle = window.__testPickedDirectory;
    const archive = await rootHandle.getDirectoryHandle('旅行资料');
    const handle = await archive.getFileHandle(fileName);
    return (await handle.getFile()).text();
  }, name);
}

async function writeArchiveProfile(page, nickname) {
  await page.evaluate(async value => {
    const rootHandle = window.__testPickedDirectory;
    const archive = await rootHandle.getDirectoryHandle('旅行资料');
    const handle = await archive.getFileHandle('profile.json', { create: true });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify({ app: '记录我的中国行', nickname: value, lifeMotto: '', hometownCityKey: '', avatar: '' }));
    await writable.close();
  }, nickname);
}

async function run() {
  const server = await startServer();
  const { port } = server.address();
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const failures = [];

  await page.addInitScript(() => {
    class MemoryFileHandle {
      constructor(name) { this.kind = 'file'; this.name = name; this.data = new Blob([]); }
      async createWritable() {
        return {
          write: async value => { this.data = value instanceof Blob ? value : new Blob([value]); },
          close: async () => {},
        };
      }
      async getFile() { return new File([this.data], this.name, { type: this.data.type }); }
    }
    class MemoryDirectoryHandle {
      constructor(name) { this.kind = 'directory'; this.name = name; this.entries = new Map(); }
      async getDirectoryHandle(name, options = {}) {
        const current = this.entries.get(name);
        if (current?.kind === 'directory') return current;
        if (!options.create) throw new DOMException('Not found', 'NotFoundError');
        const directory = new MemoryDirectoryHandle(name);
        this.entries.set(name, directory);
        return directory;
      }
      async getFileHandle(name, options = {}) {
        const current = this.entries.get(name);
        if (current?.kind === 'file') return current;
        if (!options.create) throw new DOMException('Not found', 'NotFoundError');
        const file = new MemoryFileHandle(name);
        this.entries.set(name, file);
        return file;
      }
      async removeEntry(name) { this.entries.delete(name); }
      values() { return this.entries.values(); }
      async queryPermission() { return 'granted'; }
      async requestPermission() { return 'granted'; }
    }
    window.__testPickedDirectory = new MemoryDirectoryHandle('测试位置');
    window.showDirectoryPicker = async () => window.__testPickedDirectory;
    const originalPut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function(value, key) {
      if (this.name === 'settings' && value?.key === 'dataFolderHandle') {
        value = { key: value.key, value: { name: value.value?.name || '测试位置' } };
      }
      return arguments.length > 1 ? originalPut.call(this, value, key) : originalPut.call(this, value);
    };
    window.confirm = () => true;
  });

  try {
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#localModeBtn'));
    await page.evaluate(() => {
      document.querySelector('#localModeBtn').click();
      document.querySelector('#accountBtn').click();
    });

    try {
      const state = await page.evaluate(() => ({
        localVisible: !document.querySelector('#authLocalView').hidden,
        pick: !!document.querySelector('#pickFolderBtn'),
        sync: !!document.querySelector('#syncFolderBtn'),
        restore: !!document.querySelector('#restoreFolderBtn'),
        panelFits: (() => {
          const rect = document.querySelector('.auth-panel').getBoundingClientRect();
          return rect.top >= 0 && rect.bottom <= innerHeight;
        })(),
      }));
      assert(state.localVisible, '本机模式面板未显示');
      assert(state.pick && state.sync && state.restore, '本机模式缺少资料文件夹操作');
      assert(state.panelFits, '本机资料面板超出视口');
      console.log('PASS local panel exposes folder actions');
    } catch (error) {
      failures.push(`local panel exposes folder actions: ${error.message}`);
    }

    try {
      const labels = await page.evaluate(() => ({
        modalTitle: document.querySelector('#gravityGalleryBtn')?.parentElement?.textContent.includes('相册管理'),
        modalButton: document.querySelector('#gravityGalleryBtn')?.textContent.includes('查看全部相册'),
        detailButton: document.querySelector('#attGravityGalleryBtn')?.textContent.includes('查看全部相册'),
      }));
      assert(labels.modalTitle && labels.modalButton && labels.detailButton, `相册文案未全部更新：${JSON.stringify(labels)}`);
      console.log('PASS album management labels are consistent');
    } catch (error) {
      failures.push(`album management labels are consistent: ${error.message}`);
    }

    try {
      const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
      assert(source.includes("className='att-card-edit-btn'") && source.includes('openPhotoViewer(photos,0,true') && !source.includes("card.addEventListener('dblclick'"), '景点卡片交互仍是旧的单击/双击逻辑');
      assert(source.includes('viewer-media-tabs') && source.includes('videoItems'), '景点查看器缺少照片/视频切换入口');
      assert(source.includes('openStoredVideo') && source.includes('getAllPhotos()).find(photo=>photo.id===resolved.id'), '景点视频缺少本地原文件恢复逻辑');
      assert(source.includes('stackViewerMediaTabs') && source.includes('openStackVideoTab'), '相册堆叠查看器缺少视频浏览入口');
      assert(source.includes('videoLightboxPrev') && source.includes('videoLightboxNext') && source.includes('videoLightboxFullscreen'), '视频查看器缺少切换或全屏功能');
      assert(source.includes('videoLightboxAll') && source.includes('videoLightboxStrip') && source.includes('renderVideoLightboxStrip'), '视频查看器缺少查看全部视频入口');
      assert(source.includes("wrap.classList.toggle('globe-on',preview);") && source.includes('if(hover&&!dragging) phi+=0.0035'), '旅行轨迹地球未实现常驻显示、悬停旋转');
      assert(source.includes('.memory-book.active:not(.opening) .memory-book-spine-face{opacity:1;}') && source.includes('rig.spine.visible=true'), '旅行书籍默认书脊未显示');
      assert(source.includes('backface-visibility:hidden') && source.includes('.memory-page-turner::before'), '翻页动画缺少统一纸张背面处理');
      console.log('PASS attraction cards use single-click viewing and an edit button');
    } catch (error) {
      failures.push(`attraction cards use single-click viewing and an edit button: ${error.message}`);
    }

    try {
      await page.evaluate(() => document.querySelector('#pickFolderBtn').click());
      await page.waitForFunction(() => document.querySelector('#folderPathText')?.textContent.includes('已连接'));
      await page.waitForFunction(() => document.querySelector('#folderStatus')?.textContent.includes('已同步到资料文件夹'));
      const profile = JSON.parse(await readArchiveFile(page, 'profile.json'));
      const index = JSON.parse(await readArchiveFile(page, 'index.json'));
      const storedHandle = await page.evaluate(async () => {
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open('TravelPhotosDB', 6);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        return new Promise((resolve, reject) => {
          const request = db.transaction('settings', 'readonly').objectStore('settings').get('dataFolderHandle');
          request.onsuccess = () => resolve(!!request.result?.value);
          request.onerror = () => reject(request.error);
        });
      });
      assert(profile.app, '导出的 profile.json 缺少应用标识');
      assert(Array.isArray(index.cities), '导出的 index.json 缺少城市列表');
      assert(storedHandle, '所选资料文件夹句柄未保存到 IndexedDB');
      console.log('PASS choosing a folder exports an archive');
    } catch (error) {
      failures.push(`choosing a folder exports an archive: ${error.message}`);
    }

    try {
      await page.evaluate(async () => {
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open('TravelPhotosDB', 6);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        await new Promise((resolve, reject) => {
          const tx = db.transaction(['cityMeta', 'photos'], 'readwrite');
          tx.objectStore('cityMeta').put({
            cityKey: '110000_北京市', cityName: '北京市', visitMonth: '2026-09', visitMonths: ['2026-09'],
            description: '文件夹往返测试', rating: 5, tags: [], attractions: [],
          });
          tx.objectStore('photos').add({
            cityKey: '110000_北京市', cityName: '北京市', adcode: '110000', name: 'pixel.png',
            dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XxKpAAAAAElFTkSuQmCC',
            timestamp: 1, order: 1,
          });
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
        });
      });
      await page.evaluate(() => document.querySelector('#syncFolderBtn').click());
      await page.waitForTimeout(600);
      const cityArchive = await page.evaluate(async () => {
        const rootHandle = window.__testPickedDirectory;
        const archive = await rootHandle.getDirectoryHandle('旅行资料');
        const year = await archive.getDirectoryHandle('2026');
        const city = await year.getDirectoryHandle('北京市');
        const info = JSON.parse(await (await (await city.getFileHandle('info.json')).getFile()).text());
        const photos = await city.getDirectoryHandle('photos');
        const photo = await photos.getFileHandle(info.photos[0].file.split('/').pop());
        return { info, photoSize: (await photo.getFile()).size };
      });
      assert(cityArchive.info.description === '文件夹往返测试', '城市元数据未导出');
      assert(cityArchive.info.photos.length === 1 && cityArchive.photoSize > 0, '城市照片未导出');
      console.log('PASS city metadata and photos export to the archive');
    } catch (error) {
      failures.push(`city metadata and photos export to the archive: ${error.message}`);
    }

    try {
      await page.evaluate(async url => {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], 'travel-video.mp4', { type: 'video/mp4' });
        await window.TravelVideo.importFile(file, {
          name: '北京市', cityKey: '110000_北京市', adcode: '110000',
        }, 2);
      }, `http://127.0.0.1:${port}/${videoFixture.slice(root.length + 1).split(path.sep).map(encodeURIComponent).join('/')}`);
      await page.waitForFunction(async () => {
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open('TravelPhotosDB', 6);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const records = await new Promise((resolve, reject) => {
          const request = db.transaction('photos', 'readonly').objectStore('photos').getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        return records.some(record => record.kind === 'video' && record.blob instanceof Blob && record.dataUrl.startsWith('data:image/'));
      }, null, { timeout: 25000 });
      const ui = await page.evaluate(() => ({
        acceptsVideo: document.querySelector('#fileInput').accept.includes('video'),
        hasMediaTabs: !!document.querySelector('#mfVideoCount'),
      }));
      assert(ui.acceptsVideo, '本机模式上传入口未接受视频');
      assert(ui.hasMediaTabs, '城市弹窗缺少照片/视频分类');
      const preview = await page.evaluate(async () => {
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open('TravelPhotosDB', 6);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const records = await new Promise((resolve, reject) => {
          const request = db.transaction('photos', 'readonly').objectStore('photos').getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        window.TravelVideo.open(records.find(record => record.kind === 'video'));
        return {
          visible: document.querySelector('#videoLightbox').classList.contains('show'),
          source: document.querySelector('#videoLightboxPlayer').src,
          download: document.querySelector('#videoLightboxDownload').download,
        };
      });
      assert(preview.visible && preview.source.startsWith('blob:'), '视频预览器没有加载本机 Blob');
      assert(preview.download === 'travel-video.mp4', '视频下载文件名不正确');
      await page.click('#videoLightboxClose');

      await page.evaluate(() => document.querySelector('#syncFolderBtn').click());
      await page.waitForFunction(() => document.querySelector('#folderStatus')?.textContent.includes('已同步到资料文件夹'));
      const archived = await page.evaluate(async () => {
        const archive = await window.__testPickedDirectory.getDirectoryHandle('旅行资料');
        const year = await archive.getDirectoryHandle('2026');
        const city = await year.getDirectoryHandle('北京市');
        const info = JSON.parse(await (await (await city.getFileHandle('info.json')).getFile()).text());
        const videos = await city.getDirectoryHandle('videos');
        const video = info.photos.find(item => item.kind === 'video');
        const source = await videos.getFileHandle(video.file.split('/').pop());
        const poster = await videos.getFileHandle(video.poster.split('/').pop());
        return { video, sourceSize: (await source.getFile()).size, posterSize: (await poster.getFile()).size };
      });
      assert(archived.sourceSize > 0, '资料文件夹中没有视频原文件');
      assert(archived.posterSize > 0, '资料文件夹中没有视频首帧封面');
      console.log('PASS local video upload stores a blob and mirrors source plus poster');
    } catch (error) {
      failures.push(`local video upload stores a blob and mirrors source plus poster: ${error.message}`);
    }

    try {
      const result = await page.evaluate(async url => {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], 'attraction-video.mp4', { type: 'video/mp4' });
        const attraction = { photos: [] };
        const saved = await window.TravelVideo.importAttractionFile(file, {
          name: '北京市', cityKey: '110000_北京市', adcode: '110000',
        }, attraction, 3);
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open('TravelPhotosDB', 6);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const records = await new Promise((resolve, reject) => {
          const request = db.transaction('photos', 'readonly').objectStore('photos').getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        return {
          attraction: attraction.photos[0],
          cityVideos: records.filter(record => record.kind === 'video' && record.name === 'attraction-video.mp4').length,
          savedKind: saved.kind,
        };
      }, `http://127.0.0.1:${port}/${videoFixture.slice(root.length + 1).split(path.sep).map(encodeURIComponent).join('/')}`);
      assert(result.savedKind === 'video', '景点视频导入未返回视频媒体');
      assert(result.attraction.kind === 'video' && result.attraction.dataUrl.startsWith('data:image/'), '景点未保存视频首帧信息');
      assert(result.cityVideos === 1, '景点视频未同步到城市媒体表');
      console.log('PASS attraction video joins the city media library');
    } catch (error) {
      failures.push(`attraction video joins the city media library: ${error.message}`);
    }

    try {
      await page.evaluate(() => {
        document.querySelector('#authLocalView').hidden = true;
        document.querySelector('#authUserView').hidden = false;
        document.querySelector('#editNicknameBtn2').click();
      });
      await page.fill('#nicknameInput', '自动同步测试');
      await page.click('#saveNicknameBtn');
      await page.waitForTimeout(3000);
      const profile = JSON.parse(await readArchiveFile(page, 'profile.json'));
      assert(profile.nickname === '自动同步测试', `本机资料修改后未自动同步，实际为 ${profile.nickname}`);
      console.log('PASS local edits mirror automatically');
    } catch (error) {
      failures.push(`local edits mirror automatically: ${error.message}`);
    }

    try {
      await writeArchiveProfile(page, '不应恢复');
      await page.evaluate(() => {
        window.__restoreConfirmCount = 0;
        window.confirm = () => { window.__restoreConfirmCount += 1; return false; };
        document.querySelector('#restoreFolderBtn').click();
      });
      await page.waitForTimeout(300);
      const cancelled = await page.evaluate(() => ({
        nickname: document.querySelector('#profileNickname').textContent,
        confirmCount: window.__restoreConfirmCount,
      }));
      assert(cancelled.confirmCount === 1, '恢复前没有请求用户确认');
      assert(cancelled.nickname === '自动同步测试', '取消恢复仍覆盖了浏览器资料');

      await writeArchiveProfile(page, '文件夹恢复成功');
      await page.evaluate(() => {
        window.confirm = () => true;
        document.querySelector('#restoreFolderBtn').click();
      });
      await page.waitForFunction(() => document.querySelector('#profileNickname').textContent === '文件夹恢复成功');
      await page.waitForFunction(() => document.querySelector('#folderStatus')?.textContent.includes('已从资料文件夹恢复'));
      const restored = await page.evaluate(async () => {
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open('TravelPhotosDB', 6);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const readAll = store => new Promise((resolve, reject) => {
          const request = db.transaction(store, 'readonly').objectStore(store).getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const metas = await readAll('cityMeta'), photos = await readAll('photos');
        return {
          metas,
          photos: photos.map(photo => ({ cityKey: photo.cityKey, dataUrl: photo.dataUrl, kind: photo.kind })),
          hasVideoBlob: photos.some(photo => photo.kind === 'video' && photo.blob instanceof Blob && photo.blob.size > 0),
        };
      });
      assert(restored.metas.some(meta => meta.description === '文件夹往返测试'), '城市元数据未从文件夹恢复');
      assert(restored.photos.some(photo => photo.cityKey === '110000_北京市' && photo.dataUrl.startsWith('data:image/')), '城市照片未从文件夹恢复');
      assert(restored.hasVideoBlob, '城市视频未从文件夹恢复');
      console.log('PASS restore requires confirmation and loads folder data');
    } catch (error) {
      failures.push(`restore requires confirmation and loads folder data: ${error.message}`);
    }

    try {
      await page.click('#enableCloudBtn');
      const result = await page.evaluate(async () => {
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open('TravelPhotosDB', 6);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const records = await new Promise((resolve, reject) => {
          const request = db.transaction('photos', 'readonly').objectStore('photos').getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        return {
          localVideoCount: records.filter(photo => photo.kind === 'video' && photo.blob instanceof Blob).length,
          acceptsVideo: document.querySelector('#fileInput').accept.includes('video'),
        };
      });
      assert(result.localVideoCount === 2, '云端恢复删除了本机视频');
      assert(!result.acceptsVideo, '云端模式仍允许选择视频');
      console.log('PASS switching to cloud keeps local videos and disables video upload');
    } catch (error) {
      failures.push(`switching to cloud keeps local videos and disables video upload: ${error.message}`);
    }

    try {
      await page.evaluate(async () => {
        const archive = new (window.__testPickedDirectory.constructor)('旅行资料');
        const profile = await archive.getFileHandle('profile.json', { create: true });
        const writable = await profile.createWritable();
        await writable.write(JSON.stringify({
          app: '记录我的中国行', nickname: '跨浏览器恢复成功', lifeMotto: '', hometownCityKey: '', avatar: '',
        }));
        await writable.close();
        window.__testPickedDirectory = archive;
        window.confirm = () => true;
        document.querySelector('#pickFolderBtn').click();
      });
      await page.waitForFunction(() => document.querySelector('#profileNickname').textContent === '跨浏览器恢复成功', null, { timeout: 3000 });
      const result = await page.evaluate(async () => {
        const archive = window.__testPickedDirectory;
        const profile = JSON.parse(await (await (await archive.getFileHandle('profile.json')).getFile()).text());
        return {
          nickname: profile.nickname,
          nestedArchiveCreated: archive.entries.has('旅行资料'),
          displayedPath: document.querySelector('#folderPathText').textContent,
        };
      });
      assert(result.nickname === '跨浏览器恢复成功', '选择已有资料时备份被当前浏览器数据覆盖');
      assert(!result.nestedArchiveCreated, '直接选择「旅行资料」后又创建了重复嵌套目录');
      assert(result.displayedPath === '已连接：旅行资料', `资料文件夹路径显示错误：${result.displayedPath}`);
      console.log('PASS selecting an existing archive restores without nesting or overwriting');
    } catch (error) {
      failures.push(`selecting an existing archive restores without nesting or overwriting: ${error.message}`);
    }

    try {
      const counts = await page.evaluate(() => window.TravelVideo.countMedia([
        { kind: 'image' }, { kind: 'video' }, { kind: 'image' },
      ]));
      assert(counts.photos === 2 && counts.videos === 1 && counts.total === 3, `照片和视频未分开计数：${JSON.stringify(counts)}`);
      console.log('PASS city card separates photo and video counts');
    } catch (error) {
      failures.push(`city card separates photo and video counts: ${error.message}`);
    }

    try {
      await page.evaluate(() => window.__imgViewer.open([
        { dataUrl: 'data:image/png;base64,AA==', name: 'one.png' },
        { dataUrl: 'data:image/png;base64,AA==', name: 'two.png' },
        { dataUrl: 'data:image/png;base64,AA==', name: 'three.png' },
      ], 0));
      const controls = await page.evaluate(() => ({
        modeButtons: document.querySelectorAll('.stack-mode .vm-btn').length,
        wall: !!document.querySelector('.stack-mode .viewer-wall'),
      }));
      assert(controls.modeButtons === 2 && controls.wall, '照片查看器缺少浏览模式和照片墙容器');
      await page.click('.stack-mode .vm-btn[data-mode="wall"]');
      const wall = await page.evaluate(() => ({
        active: document.querySelector('.stack-mode').classList.contains('wall-mode'),
        tiles: document.querySelectorAll('.stack-mode .wall-tile').length,
      }));
      assert(wall.active && wall.tiles === 3, `照片墙未正确显示：${JSON.stringify(wall)}`);
      await page.click('.stack-mode .wall-tile');
      await page.waitForSelector('.stack-mode .wall-zoom.show');
      await page.click('.stack-mode .wall-zoom .wz-close');
      await page.click('.stack-mode .close-btn');
      console.log('PASS photo viewer switches to wall mode and opens wall zoom');
    } catch (error) {
      failures.push(`photo viewer switches to wall mode and opens wall zoom: ${error.message}`);
    }

  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  if (failures.length) {
    console.error(failures.map(f => `FAIL ${f}`).join('\n'));
    process.exitCode = 1;
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
