const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('年轮足迹同步真实到访记录、年份筛选，桌面独立占位、手机可折叠、大图隐藏',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    await page.setContent('<iframe style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>');
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/image-atlas/embedded.js')});
    await page.evaluate(()=>{
      const src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#849e93"/></svg>');
      const records=[2025,2025,2026].map((year,i)=>({id:String(i),title:'北京市',tags:'北京市',src,full:src,aspect:4/3,year,date:String(year),dateSource:'city',visitYears:[2025,2026]}));
      const visits=[{cityKey:'bj',name:'北京市',month:'2025-04',date:'2025-04-12',visitOrder:1},{cityKey:'bj',name:'北京市',month:'2025-09',date:'',visitOrder:2},{cityKey:'tj',name:'天津市',month:'2026-06',date:'',visitOrder:1},{cityKey:'unknown',name:'待补充城市',month:'',date:'',visitOrder:1}];
      document.querySelector('iframe').srcdoc=window.ImageAtlasDocument(records,visits);
    });
    const atlas=page.frameLocator('iframe');
    await atlas.locator('.image-card').first().waitFor({state:'attached'});
    assert.equal(await atlas.locator('.journey-visit').count(),4,'所有到访记录均展示，而不是只列有照片的城市');
    assert.match(await atlas.locator('[data-journey-year="2025"]').textContent(),/2 次旅程.*1 座城市/s);
    assert.equal(await atlas.locator('[data-journey-year="2025"] .journey-visit').first().textContent(),'北京市2025-09第 2 次抵达');
    assert.equal(await atlas.locator('[data-journey-year="2025"] .journey-visit').last().textContent(),'北京市2025-04-12第 1 次抵达');
    assert.match(await atlas.locator('[data-journey-year="年份未确定"]').textContent(),/时间未记录/);
    const layout=await atlas.locator('#journey-panel').evaluate(el=>({right:el.getBoundingClientRect().right,left:document.querySelector('#space').getBoundingClientRect().left,font:getComputedStyle(el).fontFamily}));
    assert.ok(layout.right<=layout.left,'足迹栏不能覆盖照片空间');assert.match(layout.font,/Songti|Serif|Georgia/);
    assert.equal(await atlas.locator('#journey-toggle').isVisible(),true,'桌面足迹栏提供隐藏按钮');
    await atlas.locator('#journey-toggle').click();
    assert.equal(await atlas.locator('#journey-panel').isVisible(),false);
    assert.equal(await atlas.locator('#space').evaluate(el=>el.getBoundingClientRect().left),0,'隐藏后释放照片空间');
    assert.equal(await atlas.locator('#journey-toggle').getAttribute('aria-expanded'),'false');
    await atlas.locator('#journey-toggle').click();
    assert.equal(await atlas.locator('#journey-panel').isVisible(),true,'可再次展开');
    await atlas.locator('#timeline [data-year="2025"]').click();
    assert.equal(await atlas.locator('.journey-year:not([hidden])').count(),1);
    assert.equal(await atlas.locator('.journey-year:not([hidden]) .journey-visit').count(),2);
    await atlas.locator('.image-card:not([hidden])').first().evaluate(el=>el.dispatchEvent(new MouseEvent('click')));
    await atlas.locator('#selection').waitFor({state:'visible'});
    assert.equal(await atlas.locator('#journey-panel').isVisible(),false,'查看大图时隐藏足迹');
    await atlas.locator('#back').click();await atlas.locator('#journey-panel').waitFor({state:'visible'});
    await page.setViewportSize({width:390,height:844});
    assert.equal(await atlas.locator('#journey-panel').isVisible(),false);
    await atlas.locator('#journey-toggle').click();await atlas.locator('#journey-panel').waitFor({state:'visible'});
    const mobile=await atlas.locator('#journey-panel').evaluate(el=>({bottom:el.getBoundingClientRect().bottom,top:document.querySelector('#space').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth}));
    assert.ok(mobile.bottom<=mobile.top,'手机展开足迹时也不覆盖照片区域');assert.equal(mobile.overflow,false);
    await atlas.locator('#journey-toggle').click();assert.equal(await atlas.locator('#journey-panel').isVisible(),false);
  }finally{await browser.close();}
});
