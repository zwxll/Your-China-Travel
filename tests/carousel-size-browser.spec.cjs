const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const styles=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
const anchor=html.indexOf('* 3D 旋转木马架构'),start=html.indexOf('(function(){',anchor),exportAt=html.indexOf('window.__imgViewerCarousel={',start),end=html.indexOf('})();',exportAt)+5;

test('旋转木马前景尺寸不随照片数量放大，切换及缩放后仍正确，手机不溢出',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1600,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setContent('<style>'+styles+'</style>');
    await page.evaluate(html.slice(start,end));
    const open=async n=>{
      await page.evaluate(n=>window.__imgViewerCarousel.open(Array.from({length:n},()=>({dataUrl:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'})),0,{sizeScale:1.1}),n);
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    };
    const active=page.locator('.carousel-mode .photo-card.is-active');
    for(const n of [1,6,12,16,40]){
      await open(n);
      const box=await active.boundingBox();
      assert.ok(Math.abs(box.width-417)<1,`${n}张照片时前景应放大15%并保持417px宽，实际${box.width}`);
      assert.ok(Math.abs(box.height-557)<1);
    }
    await open(16);
    await page.locator('.carousel-mode .nav-next').click();
    await page.waitForFunction(()=>document.querySelector('.carousel-mode .counter').textContent==='2 / 16' && Math.abs(document.querySelector('.carousel-mode .photo-card.is-active').getBoundingClientRect().width-417)<1);
    await active.dblclick();
    assert.ok(Math.abs((await active.boundingBox()).width-834)<1,'仍支持双击放大');
    await active.dblclick();
    assert.ok(Math.abs((await active.boundingBox()).width-417)<1);
    await page.waitForTimeout(850); // 等待上一轮切换的820ms交互锁释放
    await page.mouse.move(800,450);await page.mouse.down();await page.mouse.move(1150,450,{steps:8});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.mouse.up();
    await page.waitForFunction(()=>document.querySelector('.carousel-mode .counter').textContent!=='2 / 16' && Math.abs(document.querySelector('.carousel-mode .photo-card.is-active').getBoundingClientRect().width-417)<1);
    for(const viewport of [{width:390,height:844},{width:844,height:390}]){
      await page.setViewportSize(viewport);await open(16);
      const box=await active.boundingBox();
      assert.ok(box.width<=viewport.width*.8 && box.height<=viewport.height*.75);
      assert.ok(box.x>=0 && box.y>=0 && box.x+box.width<=viewport.width && box.y+box.height<=viewport.height,JSON.stringify({viewport,box}));
    }
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
