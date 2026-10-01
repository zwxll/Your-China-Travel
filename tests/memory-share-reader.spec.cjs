const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('只读相册支持手机翻页、滑动、城市切换、照片放大和电脑双页',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
    async function checkFrames(){
      const frames=await page.locator('#book .shared-photo img:visible').evaluateAll(images=>images.map(img=>{const r=img.getBoundingClientRect(),s=getComputedStyle(img),cell=img.parentElement.getBoundingClientRect();return {ratio:(r.width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight))/(r.height-parseFloat(s.paddingTop)-parseFloat(s.paddingBottom)),natural:img.naturalWidth/img.naturalHeight,fits:r.width<=cell.width+1&&r.height<=cell.height+1};}));
      assert.ok(frames.length>0);
      assert.ok(frames.every(frame=>frame.fits&&Math.abs(frame.ratio-frame.natural)<.02),'白色相框贴合完整照片比例，不拉伸也不溢出');
    }
    page.on('pageerror',error=>errors.push(error.message));
    const photo={dataUrl:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#719688"/></svg>'),name:'旅行照片'};
    const landscape={...photo,dataUrl:photo.dataUrl.replace('width%3D%22400%22','width%3D%22800%22')};
    await page.route('**/functions/v1/memory-shelf-share',route=>route.fulfill({json:{snapshot:{provinces:[{name:'浙江省',cities:[{name:'杭州市',photos:Array(5).fill(photo)},{name:'金华市',photos:[photo]},{name:'九图城市',photos:Array(9).fill(photo)},{name:'横图城市',photos:Array(4).fill(landscape)},{name:'空城市',photos:[]}]}]}}}));
    await page.goto(pathToFileURL(path.resolve('memory-share.html')).href+'?s=00000000-0000-4000-8000-000000000001');
    await page.getByRole('button',{name:/浙江省/}).click();
    await page.locator('#book[data-layout="portrait"]').waitFor({timeout:2000});
    assert.deepEqual(await page.locator('#book .book-page:not(.shared-cover)').evaluateAll(leaves=>leaves.map(leaf=>leaf.querySelectorAll('.shared-photo').length)),[0,1,2,2]);
    assert.equal(await page.locator('#book .shared-photo').count(),5);
    await page.waitForFunction(()=>document.querySelectorAll('.shared-photo-grid[data-layout="two-portrait"]').length===2);
    const status=page.locator('#page-status'),initial=await status.innerText();
    await page.getByRole('button',{name:'下一页',exact:true}).click();
    await page.waitForFunction(old=>document.querySelector('#page-status').textContent!==old,initial);
    await page.waitForFunction(()=>document.querySelector('#book')?.getAttribute('aria-busy')==='false');
    assert.notEqual(await status.innerText(),initial);
    await page.getByRole('button',{name:'上一页',exact:true}).tap();
    await page.waitForFunction(old=>document.querySelector('#page-status').textContent===old&&document.querySelector('#book').getAttribute('aria-busy')==='false',initial,{timeout:2000});
    await page.getByRole('button',{name:'下一页',exact:true}).tap();
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('3 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    const beforeSwipe=await status.innerText();
    await page.locator('#book').evaluate(book=>{
      const surface=book.querySelector('.stf__block');
      const r=surface.getBoundingClientRect(),x=r.left+r.width*.8,y=r.top+r.height*.5;
      const start=new Touch({identifier:1,target:surface,clientX:x,clientY:y});
      const end=new Touch({identifier:1,target:surface,clientX:r.left+5,clientY:y});
      surface.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[start],changedTouches:[start]}));
      surface.dispatchEvent(new TouchEvent('touchmove',{bubbles:true,cancelable:true,touches:[end],changedTouches:[end]}));
      surface.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[end]}));
    });
    await page.waitForFunction(old=>document.querySelector('#page-status').textContent!==old,beforeSwipe);
    await page.waitForFunction(()=>document.querySelector('#book')?.getAttribute('aria-busy')==='false');
    // 从照片上起手，慢速拖至右边缘后松手，仍能返回上一页。
    await page.getByRole('button',{name:'查看第 3 张照片',exact:true}).evaluate(async button=>{
      const target=button.querySelector('img'),r=target.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
      const start=new Touch({identifier:2,target,clientX:x,clientY:y});
      target.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,cancelable:true,touches:[start],changedTouches:[start]}));
      await new Promise(resolve=>setTimeout(resolve,400));
      const edge=button.closest('#book').querySelector('.stf__block').getBoundingClientRect().right-5;
      const end=new Touch({identifier:2,target,clientX:edge,clientY:y+16});
      target.dispatchEvent(new TouchEvent('touchmove',{bubbles:true,cancelable:true,touches:[end],changedTouches:[end]}));
      target.dispatchEvent(new TouchEvent('touchend',{bubbles:true,cancelable:true,touches:[],changedTouches:[end]}));
    });
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('3 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false',null,{timeout:2000});
    assert.equal(await page.locator('#viewer').evaluate(viewer=>viewer.open),false,'滑动不误开照片');
    for(const gesture of [{dx:8,dy:100,cancel:false},{dx:100,dy:0,cancel:true}]){
      await page.locator('#book').evaluate((book,gesture)=>{
        const target=book.querySelector('.stf__block'),r=target.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
        const start=new Touch({identifier:3,target,clientX:x,clientY:y}),end=new Touch({identifier:3,target,clientX:x+gesture.dx,clientY:y+gesture.dy});
        target.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,cancelable:true,touches:[start],changedTouches:[start]}));
        const move=new TouchEvent('touchmove',{bubbles:true,cancelable:true,touches:[end],changedTouches:[end]});target.dispatchEvent(move);
        if(move.defaultPrevented!==gesture.cancel)throw Error('纵向滚动被阻止或横向滑动未接管');
        target.dispatchEvent(new TouchEvent(gesture.cancel?'touchcancel':'touchend',{bubbles:true,cancelable:true,touches:[],changedTouches:[end]}));
      },gesture);
      await page.waitForFunction(()=>document.querySelector('#book').getAttribute('aria-busy')==='false');
      assert.match(await status.innerText(),/^3 \//);
      assert.equal(await page.locator('#book').getAttribute('aria-busy'),'false','纵向滑动或取消手势不启动翻页');
    }
    await page.getByRole('button',{name:'查看第 1 张照片',exact:true}).tap();
    assert.equal(await page.locator('#count').innerText(),'1 / 5');
    await page.locator('#close').click();
    assert.equal(await page.getByRole('button',{name:'下一页',exact:true}).isEnabled(),true,'关闭照片后页角预览不锁住按钮');
    await page.getByRole('button',{name:'下一页',exact:true}).tap();
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('4 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    await page.getByRole('button',{name:'查看第 3 张照片',exact:true}).click();
    assert.equal(await page.locator('#count').innerText(),'3 / 5');
    await page.locator('#close').click();
    await page.getByRole('button',{name:'九图城市',exact:true}).click();
    assert.deepEqual(await page.locator('#book .book-page:not(.shared-cover)').evaluateAll(leaves=>leaves.map(leaf=>leaf.querySelectorAll('.shared-photo').length)),[0,1,2,1,1,4]);
    assert.deepEqual(await page.locator('#book .shared-photo').evaluateAll(buttons=>buttons.map(button=>button.getAttribute('aria-label'))),Array.from({length:9},(_,i)=>'查看第 '+(i+1)+' 张照片'));
    await page.setViewportSize({width:1280,height:900});
    await page.locator('#book[data-layout="landscape"]').waitFor();
    for(const label of ['4 /','6 /']){
      await page.getByRole('button',{name:'下一页',exact:true}).click();
      await page.waitForFunction(prefix=>document.querySelector('#page-status').textContent.startsWith(prefix)&&document.querySelector('#book').getAttribute('aria-busy')==='false',label);
    }
    assert.equal(await page.locator('.shared-photo-grid[data-layout="four"] .shared-photo').evaluateAll(buttons=>buttons.every(button=>{const r=button.getBoundingClientRect(),p=button.closest('.book-page').getBoundingClientRect();return r.width>0&&r.height>0&&r.left>=p.left&&r.right<=p.right+1&&r.top>=p.top&&r.bottom<=p.bottom+1;})),true);
    await checkFrames();
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-shared-book-four.png'),fullPage:true});
    await page.keyboard.press('ArrowLeft');
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('4 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('6 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('button',{name:'横图城市',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.shared-photo-grid[data-layout="two-landscape"] img')?.naturalWidth===800);
    await page.getByRole('button',{name:'下一页',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('3 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    await checkFrames();
    await page.getByRole('button',{name:'金华市',exact:true}).click();
    await page.getByRole('button',{name:'下一页',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('3 /'));
    await page.waitForFunction(()=>document.querySelector('#book')?.getAttribute('aria-busy')==='false');
    await page.getByRole('button',{name:'查看第 1 张照片',exact:true}).click();
    assert.equal(await page.locator('#count').innerText(),'1 / 1');
    await page.locator('#close').click();
    await page.getByRole('button',{name:'空城市',exact:true}).click();
    assert.match(await page.locator('.chapter').innerText(),/暂无照片/);
    await page.getByRole('button',{name:'杭州市',exact:true}).click();
    await page.setViewportSize({width:1280,height:900});
    await page.locator('#book[data-layout="landscape"]').waitFor();
    await page.getByRole('button',{name:'下一页',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('4 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-shared-book-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    await page.locator('#book[data-layout="portrait"]').waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.equal(await page.getByRole('button',{name:'查看第 2 张照片',exact:true}).evaluate(button=>button.getBoundingClientRect().height>250),true,'手机多图页使用整页可用高度');
    await checkFrames();
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-shared-book-mobile.png'),fullPage:true});
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
