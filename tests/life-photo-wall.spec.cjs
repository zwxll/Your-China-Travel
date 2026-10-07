const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('全部照片墙入口使用所有存储照片，排除视频并直接打开已有挂帘',async()=>{
  const html=fs.readFileSync('index.html','utf8');
  const styles=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1600,height:900}});
    const buttons=html.slice(html.indexOf('      <button id="lifeImageAtlasBtn"'),html.indexOf('  <div id="imageAtlasOverlay"'));
    await page.setContent('<style>'+styles+'</style><div>'+buttons+'</div><div id="testArchive" class="show"></div>');
    assert.equal(await page.locator('#lifePhotoWallBtn').count(),1,'新增照片墙按钮');
    const anchor=html.indexOf('原堆叠相册预览器'),start=html.indexOf('(function(){',anchor),end=html.indexOf('})();',start)+5;
    await page.evaluate(html.slice(start,end));
    const handlerStart=html.indexOf('  async function openLifePhotoWall()'),handlerEnd=html.indexOf('\n  window.initTravelCanopy',handlerStart);
    await page.evaluate(`
      const lifePhotoWallBtnEl=document.getElementById('lifePhotoWallBtn');
      const journeyArchiveOverlayEl=document.getElementById('testArchive');
      document.addEventListener('keydown',e=>{if(e.key==='Escape')journeyArchiveOverlayEl.classList.remove('show');});
      window.storedPhotos=[{id:1,cityKey:'a',kind:'image',dataUrl:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'},{id:2,cityKey:'b',kind:'image',dataUrl:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><circle/></svg>'},{id:3,cityKey:'b',kind:'video',dataUrl:'blob:video'},{id:4,cityKey:'c',kind:'image',dataUrl:''}];
      async function getAllPhotos(){return window.storedPhotos;}
      ${html.slice(handlerStart,handlerEnd)}
      lifePhotoWallBtnEl.hidden=false;
    `);
    await page.locator('#lifePhotoWallBtn').click();
    assert.equal(await page.locator('.stack-mode.wall-mode.show').count(),1);
    assert.equal(await page.locator('.curtain-rod').count(),1);
    assert.equal(await page.locator('.wall-tile').count(),2);
    assert.equal(new Set(await page.locator('.wall-tile img').evaluateAll(els=>els.map(el=>el.src))).size,2);
    await page.locator('[data-wallpos="1"]').click();
    assert.equal(await page.locator('#stackViewerCounter').textContent(),'2 / 2');
    assert.equal(await page.locator('.stack-mode .photo-card.main img').getAttribute('src'),await page.evaluate(()=>storedPhotos[1].dataUrl));
    await page.locator('.stack-mode .close-btn').click();
    await page.locator('#lifePhotoWallBtn').click();
    assert.equal(await page.locator('.stack-mode.wall-mode.show').count(),1,'再次进入必须仍是照片墙，不受横向模式偏好影响');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.stack-mode.show').count(),0);
    assert.equal(await page.locator('#testArchive.show').count(),1,'Escape只关闭照片墙，保留底下时间轴');
  }finally{await browser.close();}
});
