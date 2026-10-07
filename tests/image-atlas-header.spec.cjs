const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('年轮照片按钮位于照片数量右侧，手机和浅色主题不溢出，按压可触发原按钮',async()=>{
  const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const styles=[...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
  const start=source.indexOf('  <div id="journeyArchiveOverlay"'),end=source.indexOf('  <div id="imageAtlasOverlay"',start);
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const menu=source.slice(source.indexOf('          <button class="theme-toggle-btn footprint-btn" id="photoStreamBtn"'),source.indexOf('          <button class="theme-toggle-btn footprint-btn" id="journeyStatsBtn"'));
    const page=await browser.newPage();await page.setContent('<style>'+styles+'</style>'+menu+source.slice(start,end));
    assert.equal((await page.locator('#lifeJourneyBtn .fp-btn-label').textContent()).trim(),'旅途影像');
    assert.equal(await page.locator('#lifeJourneyBtn').getAttribute('aria-label'),'旅途影像');
    assert.equal((await page.locator('#photoStreamBtn .fp-btn-label').textContent()).trim(),'光影城市');
    assert.equal(await page.locator('#photoStreamBtn').getAttribute('aria-label'),'光影城市');
    await page.evaluate(()=>{document.querySelector('#journeyArchiveOverlay').classList.add('show','life-mode');document.querySelector('#journeyArchiveTitle').textContent='人生足迹时间轴';document.querySelector('#lifeImageAtlasBtn').hidden=false});
    const renderStart=source.indexOf('  async function renderLifeJourneyArchive()'),renderEnd=source.indexOf('\n  async function renderJourneyStatsArchive()',renderStart);
    const openStart=source.indexOf('  async function openJourneyArchive(mode)'),openEnd=source.indexOf('\n  if(lifeJourneyBtnEl)',openStart);
    await page.evaluate(`
      const $=id=>document.getElementById(id),journeyArchiveBodyEl=$('journeyArchiveBody'),lifeImageAtlasBtnEl=$('lifeImageAtlasBtn'),lifeCanopyBtnEl=$('lifeCanopyBtn'),lifePhotoWallBtnEl=$('lifePhotoWallBtn');
      let lifeDomeGalleryInstance=null;
      const journeyArchiveOverlayEl=$('journeyArchiveOverlay'),journeyArchiveKickerEl=$('journeyArchiveKicker'),journeyArchiveTitleEl=$('journeyArchiveTitle'),journeyArchiveIntroEl=$('journeyArchiveIntro');
      window.hasEntries=true;
      async function collectJourneyArchiveData(){return {cities:[{}],entries:window.hasEntries?[{month:'2026-08',city:{name:'金华市',cityKey:'a'}}]:[]};}
      async function collectLifeDomePhotos(){return Array.from({length:169},()=>({src:'sample'}));}
      function escapeHtml(v){return v;}function formatMonthShort(v){return v;}function renderStars(){return '';}
      function archiveEmptyHtml(){return '';}function bindJourneyCityButtons(){}
      function destroyLifeDomeGallery(){}async function renderJourneyStatsArchive(){journeyArchiveBodyEl.textContent='统计';}
      ${source.slice(renderStart,renderEnd)}
      ${source.slice(openStart,openEnd)}
      window.openTimeline=openJourneyArchive;
      renderLifeJourneyArchive();
    `);
    const button=page.locator('#lifeImageAtlasBtn');assert.equal((await button.textContent()).trim(),'年轮照片');
    assert.equal(await button.evaluate(el=>!!el.closest('.life-photo-dome-head')),true,'按钮位于旅途影像区域而不是顶部标题栏');
    for(const theme of ['dark','light'])for(const width of [1280,390]){
      await page.setViewportSize({width,height:844});await page.evaluate(theme=>document.body.classList.toggle('light-theme',theme==='light'),theme);
      const title=await page.locator('#journeyArchiveTitle').boundingBox(),box=await button.boundingBox(),close=await page.locator('#journeyArchiveClose').boundingBox();
      const count=await page.locator('.life-photo-dome-head em').boundingBox();
      if(width>700)assert.ok(box.x>=count.x+count.width&&Math.abs(box.y+box.height/2-count.y-count.height/2)<2,'桌面按钮紧邻照片数量右侧');
      const canopy=await page.locator('#lifeCanopyBtn').boundingBox();
      const wall=await page.locator('#lifePhotoWallBtn').boundingBox();
      assert.ok(wall.x>=box.x+box.width&&wall.x+wall.width<=width&&Math.abs(wall.y-box.y)<2,'照片墙紧邻年轮入口且手机端不溢出');
      assert.ok(canopy.x>=wall.x+wall.width&&canopy.x+canopy.width<=width&&Math.abs(canopy.y-box.y)<2,'伞幕入口保留且手机端不溢出');
      assert.ok(box.x+box.width<=width && !(box.x<close.x+close.width&&box.x+box.width>close.x&&box.y<close.y+close.height&&box.y+box.height>close.y),'按钮不得溢出或遮挡关闭按钮');
      const colors=await button.evaluate(el=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}));
      assert.notEqual(colors.background,'rgba(0, 0, 0, 0)','按钮不能继续使用透明背景');
      const luminance=color=>{const [r,g,b]=color.match(/\d+/g).slice(0,3).map(n=>{const v=Number(n)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
      const bg=luminance(colors.background),fg=luminance(colors.color);assert.ok((Math.max(bg,fg)+.05)/(Math.min(bg,fg)+.05)>=4.5,'按钮文字对比度不足');
    }
    await button.evaluate(el=>el.addEventListener('click',()=>window.wasClicked=true));
    await button.click();assert.equal(await page.evaluate(()=>window.wasClicked),true,'保留原生按钮点击事件');
    await button.focus();await page.keyboard.press('Enter');assert.equal(await button.evaluate(el=>el===document.activeElement),true);
    await page.evaluate(async()=>{
      document.querySelector('.journey-archive').insertBefore(document.getElementById('lifeImageAtlasBtn'),document.getElementById('journeyArchiveBody'));
      window.hasEntries=false;await window.openTimeline('life');
    });
    assert.equal(await button.isVisible(),false,'首次空时间轴不能在照片区域外暴露按钮');
    await page.evaluate(async()=>{window.hasEntries=true;await window.openTimeline('life');});
    assert.equal(await page.locator('#journeyArchiveTitle').textContent(),'旅途影像','弹窗打开后的实际主标题使用新名称');
    assert.equal(await button.isVisible(),true);
    await page.evaluate(()=>window.openTimeline('stats'));assert.equal(await button.isVisible(),false,'统计页不显示按钮');
    await page.evaluate(()=>window.openTimeline('life'));
    assert.equal(await button.evaluate(el=>!!el.closest('.life-photo-dome-head')),true,'重新打开仍回到照片数量旁边');
    await button.evaluate(el=>el.hidden=true);assert.equal(await button.isVisible(),false,'统计页面仍可隐藏按钮');
  }finally{await browser.close();}
});
