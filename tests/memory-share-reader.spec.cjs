const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('只读相册支持手机翻页、滑动、城市切换、照片放大和电脑双页',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const photo={dataUrl:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#719688"/></svg>'),name:'旅行照片'};
    await page.route('**/functions/v1/memory-shelf-share',route=>route.fulfill({json:{snapshot:{provinces:[{name:'浙江省',cities:[{name:'杭州市',photos:Array(5).fill(photo)},{name:'金华市',photos:[photo]},{name:'空城市',photos:[]}]}]}}}));
    await page.goto(pathToFileURL(path.resolve('memory-share.html')).href+'?s=00000000-0000-4000-8000-000000000001');
    await page.getByRole('button',{name:/浙江省/}).click();
    await page.locator('#book[data-layout="portrait"]').waitFor({timeout:2000});
    const status=page.locator('#page-status'),initial=await status.innerText();
    await page.getByRole('button',{name:'下一页',exact:true}).click();
    await page.waitForFunction(old=>document.querySelector('#page-status').textContent!==old,initial);
    await page.waitForFunction(()=>document.querySelector('#book')?.getAttribute('aria-busy')==='false');
    assert.notEqual(await status.innerText(),initial);
    const beforeSwipe=await status.innerText();
    await page.locator('#book').evaluate(book=>{
      const r=book.getBoundingClientRect(),x=r.left+r.width*.7,y=r.top+r.height*.5;
      const surface=book.querySelector('.stf__block');
      const start=new Touch({identifier:1,target:surface,clientX:x,clientY:y});
      surface.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[start],changedTouches:[start]}));
      surface.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[new Touch({identifier:1,target:surface,clientX:x-100,clientY:y})]}));
    });
    await page.waitForFunction(old=>document.querySelector('#page-status').textContent!==old,beforeSwipe);
    await page.getByRole('button',{name:'金华市',exact:true}).click();
    await page.getByRole('button',{name:'查看第 1 张照片',exact:true}).click();
    assert.equal(await page.locator('#count').innerText(),'1 / 1');
    await page.locator('#close').click();
    await page.getByRole('button',{name:'空城市',exact:true}).click();
    assert.match(await page.locator('.chapter').innerText(),/暂无照片/);
    await page.getByRole('button',{name:'杭州市',exact:true}).click();
    await page.setViewportSize({width:1280,height:900});
    await page.locator('#book[data-layout="landscape"]').waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-shared-book-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    await page.locator('#book[data-layout="portrait"]').waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-shared-book-mobile.png'),fullPage:true});
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
