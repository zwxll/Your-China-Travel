const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const html=fs.readFileSync(path.resolve('index.html'),'utf8');
const styles=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
const anchor=html.indexOf('原堆叠相册预览器'),start=html.indexOf('(function(){',anchor),end=html.indexOf('})();',start)+5;
async function setup(page,n){
  await page.setContent('<style>'+styles+'</style>');
  await page.evaluate(html.slice(start,end));
  await page.evaluate(n=>{
    window.videoCalls=[];window.TravelVideo={open:(...args)=>videoCalls.push(args)};
    const photos=Array.from({length:n},(_,i)=>({name:'照片'+i,dataUrl:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+(i%2?400:600)+'" height="400"><rect width="100%" height="100%" fill="'+['#997250','#718a8b','#82885b'][i%3]+'"/><circle cx="'+(100+i*10)+'" cy="160" r="80" fill="#d8caaa"/></svg>')}));
    window.fixturePhotos=photos;
    __imgViewer.open(photos,0,{videoItems:[{id:'video-1',dataUrl:'blob:video'}]});
  },n);
  await page.locator('.stack-mode [data-mode="wall"]').click();
}
test('胶片挂帘点击直接横向浏览，照片定位、视频切换和手机布局保留',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1600,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await setup(page,19);
    assert.equal(await page.locator('.curtain-rod').count(),1,'照片墙应有实体挂杆');
    assert.equal(await page.locator('.wall-tile').count(),19);
    const layout=await page.evaluate(()=>{
      const panel=document.querySelector('.curtain-panel').getBoundingClientRect(),wall=document.querySelector('.viewer-wall').getBoundingClientRect();
      return {panel:{x:panel.x,y:panel.y,width:panel.width,height:panel.height},wall:{y:wall.y,height:wall.height},sources:[...document.querySelectorAll('.wall-tile img')].map(i=>i.src),fits:[...document.querySelectorAll('.wall-tile img')].every(i=>getComputedStyle(i).objectFit==='contain')};
    });
    assert.equal(new Set(layout.sources).size,19,'照片不能重复或丢失');
    assert.ok(layout.panel.y>layout.wall.y+30&&layout.panel.height>layout.wall.height*.45,'少量照片也应居中展开，不挤在顶端');
    assert.ok(layout.fits,'胶片框不裁掉照片主体');
    await page.locator('[data-wallpos="8"]').click();
    assert.equal(await page.locator('.stack-mode.wall-mode').count(),0,'点击照片应直接进入横向浏览');
    assert.equal(await page.locator('.wall-zoom.show').count(),0,'不应打开独立大图层');
    assert.equal(await page.locator('#stackViewerCounter').textContent(),'9 / 19');
    assert.equal(await page.locator('.stack-mode .photo-card.main img').getAttribute('src'),await page.evaluate(()=>fixturePhotos[8].dataUrl));
    await page.keyboard.press('ArrowRight');await page.waitForTimeout(650);
    assert.equal(await page.locator('#stackViewerCounter').textContent(),'10 / 19');
    assert.equal(await page.locator('.stack-mode .photo-card.main img').getAttribute('src'),await page.evaluate(()=>fixturePhotos[9].dataUrl),'切换横向浏览应显示刚才选中的照片');
    await page.locator('.stack-mode [data-mode="wall"]').click();
    await page.screenshot({path:'C:/Users/86177/AppData/Local/Temp/travel-slide-curtain.png'});
    for(const [width,height,n] of [[390,844,19],[844,390,19],[1600,900,240],[390,844,240],[1600,900,1]]){
      await page.setViewportSize({width,height});
      await page.evaluate(n=>__imgViewer.open(Array.from({length:n},(_,i)=>fixturePhotos[i%19]),0),n);
      await page.locator('.stack-mode [data-mode="wall"]').click();
      const info=await page.evaluate(()=>{
        const w=document.querySelector('.viewer-wall'),p=document.querySelector('.curtain-panel').getBoundingClientRect();
        return {count:w.querySelectorAll('.wall-tile').length,x:p.x,right:p.right,overflow:w.scrollWidth-w.clientWidth};
      });
      assert.equal(info.count,n);assert.ok(info.x>=0&&info.right<=width&&info.overflow<=1,JSON.stringify({width,height,info}));
      if(n===240){
        await page.locator('.viewer-wall').hover();await page.mouse.wheel(0,1600);
        const lower=page.locator('[data-wallpos="236"]');await lower.scrollIntoViewIfNeeded();
        for(let x=10;x<=100;x+=15)await lower.dispatchEvent('pointermove',{clientX:x,clientY:400});
        await page.waitForTimeout(100);
        const edge=await lower.boundingBox();
        assert.ok(edge.x>=0&&edge.x+edge.width<=width,'长挂链底部摆动也不能移出屏幕：'+JSON.stringify(edge));
        await page.locator('[data-wallpos="239"]').click();
        assert.equal(await page.locator('#stackViewerCounter').textContent(),'240 / 240');
        assert.equal(await page.locator('.stack-mode.wall-mode').count(),0);
        assert.equal(await page.locator('.wall-zoom.show').count(),0);
        await page.keyboard.press('Escape');
      }
    }
    await page.evaluate(()=>__imgViewer.open(fixturePhotos,0,{videoItems:[{id:'video-1'}]}));
    await page.locator('.stack-mode [data-media-kind="video"]').click();
    assert.equal(await page.evaluate(()=>videoCalls.length),1);
    assert.equal(await page.locator('.stack-mode.show').count(),0);
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
test('挂帘划过会摆动，停止后归位，关闭与减少动态效果时不持续动画',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1200,height:900}});await setup(page,19);
    await page.waitForTimeout(2200);
    const chain=page.locator('.curtain-chain').first(),b=await chain.boundingBox();
    await page.mouse.move(b.x+10,b.y+100);await page.mouse.move(b.x+b.width-10,b.y+110,{steps:5});
    await page.waitForTimeout(50);
    assert.notEqual(await chain.evaluate(e=>getComputedStyle(e).transform),'matrix(1, 0, 0, 1, 0, 0)');
    await page.mouse.move(10,10);await page.waitForTimeout(3000);
    assert.equal(await chain.evaluate(e=>getComputedStyle(e).transform),'matrix(1, 0, 0, 1, 0, 0)');
    await page.locator('.stack-mode .close-btn').click();
    assert.equal(await page.locator('.curtain-chain').count(),0);
    await page.emulateMedia({reducedMotion:'reduce'});await setup(page,19);
    const c=page.locator('.curtain-chain').first(),box=await c.boundingBox();
    await page.mouse.move(box.x+10,box.y+100);await page.mouse.move(box.x+box.width-10,box.y+110,{steps:5});
    await page.waitForTimeout(100);
    assert.equal(await c.evaluate(e=>getComputedStyle(e).transform),'matrix(1, 0, 0, 1, 0, 0)');
  }finally{await browser.close();}
});
