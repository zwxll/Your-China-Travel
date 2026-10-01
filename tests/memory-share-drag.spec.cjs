const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

test('手机纸页跟手、可拉回，划过书页60%位置后松手即可翻页',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const photo={dataUrl:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#719688"/></svg>')};
    await page.route('**/functions/v1/memory-shelf-share',route=>route.fulfill({json:{snapshot:{provinces:[{name:'测试省',cities:[{name:'测试城市',photos:Array(9).fill(photo)}]}]}}}));
    await page.goto(pathToFileURL(path.resolve(__dirname,'../memory-share.html')).href+'?s=00000000-0000-4000-8000-000000000001');
    await page.locator('#shelf .book').click();await page.locator('#book[data-layout="portrait"]').waitFor();
    await page.getByRole('button',{name:'下一页',exact:true}).tap();
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('3 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    async function touch(type,fraction){
      await page.locator('#book').evaluate((book,{type,fraction})=>{
        const target=book.querySelector('.stf__block'),r=target.getBoundingClientRect(),point=new Touch({identifier:7,target,clientX:r.left+r.width*fraction,clientY:r.top+r.height*.7});
        target.dispatchEvent(new TouchEvent(type,{bubbles:true,cancelable:true,touches:type==='touchend'||type==='touchcancel'?[]:[point],changedTouches:[point]}));
      },{type,fraction});
    }
    const status=()=>page.locator('#page-status').innerText();
    const pageStyle=()=>page.locator('#book .book-page').evaluateAll(leaves=>leaves.map(leaf=>leaf.style.cssText).join('\n'));
    const before=await pageStyle();
    await touch('touchstart',.9);await touch('touchmove',.55);
    assert.equal(await page.locator('#book').getAttribute('aria-busy'),'true','手指尚未松开时纸页正在被拖动');
    await page.waitForFunction(old=>[...document.querySelectorAll('#book .book-page')].map(leaf=>leaf.style.cssText).join('\n')!==old,before,{timeout:1500});
    const halfway=await pageStyle();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'拖动纸页不撑出手机屏幕');
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-shared-book-drag.png'),fullPage:true});
    assert.match(await status(),/^3 \//,'拖动中页码不提前切换');
    await touch('touchmove',.85);
    await page.waitForFunction(old=>[...document.querySelectorAll('#book .book-page')].map(leaf=>leaf.style.cssText).join('\n')!==old,halfway,{timeout:1500});
    await touch('touchend',.85);
    await page.waitForFunction(()=>document.querySelector('#book').getAttribute('aria-busy')==='false');
    assert.match(await status(),/^3 \//,'中途拉回再松手回弹');
    await touch('touchstart',.9);await touch('touchmove',.41);await touch('touchend',.41);
    await page.waitForFunction(()=>document.querySelector('#book').getAttribute('aria-busy')==='false');
    assert.match(await status(),/^3 \//,'未到60%阈值松手回弹');
    await touch('touchstart',.9);await touch('touchmove',.39);
    assert.match(await status(),/^3 \//,'达到60%阈值但未松手不提前翻页');
    await touch('touchend',.39);
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('4 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    await touch('touchstart',.1);await touch('touchmove',.59);await touch('touchend',.59);
    await page.waitForFunction(()=>document.querySelector('#book').getAttribute('aria-busy')==='false');
    assert.match(await status(),/^4 \//,'反向未到60%阈值松手回弹');
    await touch('touchstart',.1);await touch('touchmove',.61);
    assert.match(await status(),/^4 \//);
    await touch('touchend',.61);
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('3 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    // 已经超过阈值后又拉回，或系统取消触摸，都不能提交翻页。
    for(const cancel of [false,true]){
      await touch('touchstart',.9);await touch('touchmove',.02);
      if(!cancel)await touch('touchmove',.55);
      await touch(cancel?'touchcancel':'touchend',cancel?.02:.55);
      await page.waitForFunction(()=>document.querySelector('#book').getAttribute('aria-busy')==='false');
      assert.match(await status(),/^3 \//);
    }
    // 使用浏览器原生触摸输入，再验证真实事件链不会被默认滚动或照片点击干扰。
    const cdp=await page.context().newCDPSession(page);
    const rect=await page.locator('#book .stf__block').boundingBox();
    async function nativeTouch(type,fraction){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:rect.x+rect.width*fraction,y:rect.y+rect.height*.7}]});}
    await nativeTouch('touchStart',.9);await nativeTouch('touchMove',.55);
    assert.equal(await page.locator('#book').getAttribute('aria-busy'),'true');
    await nativeTouch('touchMove',.35);
    assert.match(await status(),/^3 \//);
    await nativeTouch('touchEnd');
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('4 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    assert.equal(await page.locator('#viewer').evaluate(viewer=>viewer.open),false,'原生拖动不误开照片');
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
