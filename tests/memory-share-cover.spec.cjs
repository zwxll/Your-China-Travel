const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('首尾封面使用本城照片，手机长标题与书册信息不重叠',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const first='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#496975"/><circle cx="440" cy="360" r="120" fill="#d9ba85"/><path d="M0 700L200 450L600 800H0" fill="#29434c"/></svg>');
    const last=first.replace('%23496975','%237b8c70');
    await page.route('**/functions/v1/memory-shelf-share',route=>route.fulfill({json:{snapshot:{provinces:[{name:'内蒙古自治区',cities:[{name:'呼和浩特市',firstMonth:'2022-09',photos:[{dataUrl:first,name:'首图'},{dataUrl:last,name:'末图'}]},{name:'克孜勒苏柯尔克孜自治州',photos:[{dataUrl:first}]}]}]}}}));
    await page.goto(pathToFileURL(path.resolve('memory-share.html')).href+'?s=00000000-0000-4000-8000-000000000001');
    await page.getByRole('button',{name:/内蒙古自治区/}).click();
    const covers=page.locator('#book .shared-cover');
    assert.equal(await covers.locator('img').count(),2,'封面和封底均有城市摄影');
    assert.equal(await covers.first().locator('img').getAttribute('src'),first);
    assert.equal(await covers.last().locator('img').getAttribute('src'),last);
    assert.match(await covers.first().innerText(),/呼和浩特市/);
    assert.match(await covers.first().innerText(),/2 张照片/);
    await page.getByRole('button',{name:'上一页',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#book').dataset.edge==='front'&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    assert.equal(await covers.first().evaluate(cover=>{const title=cover.querySelector('h2'),head=cover.querySelector('.shared-cover-top'),foot=cover.querySelector('.shared-cover-bottom');const t=title.getBoundingClientRect(),c=cover.getBoundingClientRect();return t.top>=head.getBoundingClientRect().bottom&&t.bottom<foot.getBoundingClientRect().top&&t.left>=c.left&&t.right<=c.right&&title.scrollWidth<=title.clientWidth+1;}),true);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-share-cover-mobile.png'),fullPage:true});
    while(await page.getByRole('button',{name:'下一页',exact:true}).isEnabled()){
      await page.getByRole('button',{name:'下一页',exact:true}).click();
      await page.waitForFunction(()=>document.querySelector('#book').getAttribute('aria-busy')==='false');
    }
    assert.equal(await page.locator('#book').getAttribute('data-edge'),'back');
    assert.equal(await page.getByRole('button',{name:'上一页',exact:true}).isEnabled(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-share-back-mobile.png'),fullPage:true});
    await page.getByRole('button',{name:'克孜勒苏柯尔克孜自治州',exact:true}).click();
    await page.getByRole('button',{name:'上一页',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#book').dataset.edge==='front'&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    for(const width of [390,1280]){
      await page.setViewportSize({width,height:900});
      assert.equal(await covers.first().evaluate(cover=>cover.querySelector('h2').getBoundingClientRect().bottom<=cover.querySelector('p').getBoundingClientRect().top),true,'长城市名不压住时间');
    }
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
