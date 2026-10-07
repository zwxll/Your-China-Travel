const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('放大横图保持完全不透明，不受年轮深度淡化影响',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.setContent('<iframe style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>');
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/image-atlas/embedded.js')});
    await page.evaluate(()=>{
      const src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="1000"><rect width="2000" height="1000" fill="#203040"/></svg>');
      document.querySelector('iframe').srcdoc=window.ImageAtlasDocument([{id:'wide',title:'金华市',tags:'金华市',sourceFile:'photo.jpg',src,full:src,aspect:2,year:2026,date:'2026',dateSource:'city',visitYears:[2026]}]);
    });
    const atlas=page.frameLocator('iframe');
    await atlas.locator('.image-card').waitFor({state:'attached'});
    await atlas.locator('.image-card').evaluate(el=>el.dispatchEvent(new MouseEvent('click')));
    await atlas.locator('#selection').waitFor({state:'visible'});
    for(const viewport of [{width:1280,height:900},{width:1920,height:1080},{width:390,height:844}]){
      await page.setViewportSize(viewport);
      await atlas.locator('.is-selected').evaluate(()=>new Promise(requestAnimationFrame));
      const visual=await atlas.locator('.is-selected').evaluate(el=>({opacity:getComputedStyle(el).opacity,mask:getComputedStyle(document.querySelector('#space')).maskImage,depth:camera.z-selected.z}));
      assert.equal(visual.opacity,'1',JSON.stringify({viewport,...visual}));
      assert.equal(visual.mask,'none');
    }
  }finally{await browser.close();}
});
test('Edge 双击兼容图谱：真实适配路径、年份、搜索、看图、持久化、拖动、手机、空相册',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'travel-atlas-test-'));
  try{
    const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
    const begin=html.indexOf('  <div id="canopyOverlay"'),end=html.indexOf('  <div id="photoStreamOverlay"',begin);
    const file=path.join(folder,'index.html');
    const scripts=['data.js','embedded.js'].map(name=>'<script src="'+pathToFileURL(path.resolve(__dirname,'../assets/image-atlas/'+name)).href+'"></script>').join('');
    const button=html.match(/<button id="lifeImageAtlasBtn"[\s\S]*?<\/button>/)[0].replace(' hidden','');
    const canopyButton=html.match(/<button id="lifeCanopyBtn"[\s\S]*?<\/button>/)[0].replace(' hidden','');
    const treeButton=html.match(/<button[^>]*id="travelRingTreeBtn"[\s\S]*?<\/button>/)[0];
    const wallButton=html.match(/<button id="lifePhotoWallBtn"[\s\S]*?<\/button>/)[0];
    const canopyHost=['embedded.js','host.js'].map(name=>'<script src="'+pathToFileURL(path.resolve(__dirname,'../assets/umbrella-canopy/'+name)).href+'"></script>').join('');
    const treeHost=['embedded.js','host.js'].map(name=>'<script src="'+pathToFileURL(path.resolve(__dirname,'../assets/travel-ring-tree/'+name)).href+'"></script>').join('');
    const tactileScript='<script src="'+pathToFileURL(path.resolve(__dirname,'../assets/tactile-button.js')).href+'"></script>';
    fs.writeFileSync(file,'<meta charset="utf-8"><style>button{position:relative}button canvas{position:absolute;inset:0;pointer-events:none;width:100%;height:100%}</style>'+button+wallButton+canopyButton+treeButton+'<div id="journeyArchiveOverlay"></div>'+html.slice(begin,end)+scripts+tactileScript+canopyHost+treeHost);
    const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(file).href);
    await page.emulateMedia({reducedMotion:'reduce'});
    const start=html.indexOf("  const lifeImageAtlasBtnEl=$('lifeImageAtlasBtn')"),stop=html.indexOf('  function destroyLifeDomeGallery()',start);
    const settingsStart=html.indexOf('  async function idbGetSetting('),settingsStop=html.indexOf('  function fsEnsureDir(',settingsStart);
    await page.addScriptTag({content:`
      const $=id=>document.getElementById(id),SETTINGS_STORE='settings';
      const journeyArchiveOverlayEl=$('journeyArchiveOverlay');
      const withTimeout=p=>p;
      let dbPromise;
      function openDB(){return dbPromise||(dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('TravelAtlasFixture',1);r.onupgradeneeded=()=>r.result.createObjectStore('settings',{keyPath:'key'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}))}
      ${html.slice(settingsStart,settingsStop)}
      const entries=[{city:{cityKey:'a',name:'杭州'},month:'2024-05'},{city:{cityKey:'b',name:'北京'},month:'2023-04'},{city:{cityKey:'b',name:'北京'},month:'2025-04'}];
      let empty=false;
      async function collectJourneyArchiveData(){return {entries:empty?[]:entries}}
      async function getPhotosByCity(key){return [{id:1,name:'照片 </script><img> '+key,dataUrl:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="500"><rect width="300" height="500" fill="#8badbd"/></svg>')},{id:2,kind:'video',dataUrl:'video'}]}
      ${html.slice(start,stop)}
      window.emptyAtlas=()=>{empty=true};
      window.undatedAtlas=()=>{empty=false;entries.splice(0,entries.length,{city:{cityKey:'c',name:'未记录城市'},month:''})};
    `});
    await page.locator('#lifeImageAtlasBtn').click();
    let atlas=page.frameLocator('#imageAtlasHost iframe');
    await atlas.locator('.image-card').first().waitFor({state:'attached',timeout:5000}).catch(async error=>{throw new Error(error.message+'\n'+JSON.stringify({errors,host:await page.locator('#imageAtlasHost').textContent(),frames:await page.evaluate(()=>document.querySelector('iframe')?.contentDocument?.body?.innerText)}))});assert.equal(await atlas.locator('.image-card').count(),2);
    assert.equal(await atlas.locator('.journey-visit').count(),3,'主页真实时间轴记录同步进入年轮，重复到访不合并');
    await page.locator('#imageAtlasClose').click();await page.locator('#lifeCanopyBtn').click();
    const canopy=page.frameLocator('#canopyHost iframe');
    await canopy.locator('.index-item').first().waitFor({state:'attached'});
    const canopyRecords=await canopy.locator('body').evaluate(()=>({count:window.canopy.state.photos.length,cities:window.canopy.state.stories.length}));
    assert.equal(canopyRecords.count,2,'伞幕使用真实城市相册读取路径：跨次到访不重复，视频排除');assert.equal(canopyRecords.cities,2);
    await page.locator('#canopyClose').click();assert.equal(await page.locator('#canopyHost iframe').count(),0);
    await page.locator('#lifeImageAtlasBtn').click();await atlas.locator('.image-card').first().waitFor({state:'attached'});
    assert.match(await atlas.locator('#archive-count').textContent(),/2 张旅行照片/);
    await atlas.locator('#timeline button[data-year="2024"]').click();
    assert.equal(await atlas.locator('.image-card:not([hidden])').count(),1);
    await atlas.locator('#selection').waitFor({state:'visible'});
    assert.match(await atlas.locator('#selection-title').textContent(),/杭州/);
    await atlas.locator('#back').click();
    await atlas.locator('#search').fill('北京');await atlas.locator('#search-form').evaluate(form=>form.requestSubmit());
    await atlas.locator('#selection').waitFor({state:'visible'});
    assert.match(await atlas.locator('#selection-meta').textContent(),/2023/);
    await atlas.locator('#photo-year').selectOption('2025');
    await page.waitForFunction(()=>document.querySelector('#imageAtlasHost iframe')?.contentDocument?.querySelector('#timeline [data-year="2025"]'));
    assert.equal(await page.evaluate(async()=> (await idbGetSetting('imageAtlasYears'))['b:1']),2025);
    await page.locator('#imageAtlasClose').click();assert.equal(await page.locator('#imageAtlasHost iframe').count(),0);
    await page.locator('#lifeImageAtlasBtn').click();atlas=page.frameLocator('#imageAtlasHost iframe');
    await atlas.locator('#timeline [data-year="2025"]').waitFor();
    const before=await atlas.locator('#world').getAttribute('style');
    await page.mouse.move(640,380);await page.mouse.down();await page.mouse.move(720,450,{steps:8});await page.mouse.up();
    assert.notEqual(await atlas.locator('#world').getAttribute('style'),before);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await atlas.locator('body').evaluate(el=>el.scrollWidth<=innerWidth),true);
    const search=await atlas.locator('#search-form').boundingBox(),back=await page.locator('#imageAtlasClose').boundingBox();assert.ok(search.y>back.y+back.height);
    await page.locator('#imageAtlasClose').click();await page.evaluate(()=>window.emptyAtlas());await page.locator('#lifeImageAtlasBtn').click();
    await atlas.locator('#archive-count').waitFor();assert.match(await atlas.locator('#archive-count').textContent(),/0 张旅行照片/);
    await atlas.locator('#space').evaluate(el=>el.dispatchEvent(new WheelEvent('wheel',{deltaY:200,bubbles:true,cancelable:true})));
    await page.waitForTimeout(100);
    assert.equal(await atlas.locator('#world').evaluate(()=>Number.isFinite(desired.z)),true,'空相册滚轮不可形成无效相机');
    await page.locator('#imageAtlasClose').click();await page.evaluate(()=>window.undatedAtlas());await page.locator('#lifeImageAtlasBtn').click();
    await atlas.locator('.image-card').waitFor({state:'attached'});await atlas.locator('.image-card').evaluate(el=>el.dispatchEvent(new MouseEvent('click')));
    await atlas.locator('#selection').waitFor({state:'visible'});
    await atlas.locator('#photo-year').evaluate(el=>el.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true,cancelable:true})));
    assert.equal(await atlas.locator('#selection').isVisible(),true,'编辑年份时方向键不能移动相机或取消选图');
    assert.equal(await atlas.locator('#photo-year option[value="custom"]').count(),1,'全无日期时仍允许填写真实年份');
    page.once('dialog',dialog=>dialog.accept('2018'));await atlas.locator('#photo-year').selectOption('custom');
    await page.waitForFunction(()=>document.querySelector('#imageAtlasHost iframe')?.contentDocument?.querySelector('#timeline [data-year="2018"]'));
    assert.equal(await page.evaluate(async()=> (await idbGetSetting('imageAtlasYears'))['c:1']),2018);
    assert.deepEqual(errors,[]);
  }finally{await browser.close();fs.rmSync(folder,{recursive:true,force:true});}
});
