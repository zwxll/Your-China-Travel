const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'../assets/photo-stream');
test('城市照片缩小20%且星空位于底层，暂停、大图和返回停止背景绘制',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setContent(fs.readFileSync(path.join(root,'template.html'),'utf8').replace('<link rel="stylesheet" href="./style.css">','<style>'+fs.readFileSync(path.join(root,'style.css'),'utf8')+'</style>'));
    await page.evaluate(()=>{
      window.draws=0;window.starPixels=0;
      const draw=WebGLRenderingContext.prototype.drawArrays;
      WebGLRenderingContext.prototype.drawArrays=function(...args){
        const result=draw.apply(this,args);window.draws++;
        const pixels=new Uint8Array(this.canvas.width*this.canvas.height*4);
        this.readPixels(0,0,this.canvas.width,this.canvas.height,this.RGBA,this.UNSIGNED_BYTE,pixels);
        window.starPixels=pixels.filter((v,i)=>i%4!==3&&v>10).length;return result;
      };
    });
    const source=['math','galaxy','story'].filter(name=>fs.existsSync(path.join(root,'js',name+'.js'))).map(name=>fs.readFileSync(path.join(root,'js',name+'.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n');
    await page.addScriptTag({content:source+`\nwindow.view=new StoryView({stories:[{id:'city',title:'洛阳市',rgb:'125 140 255',chapters:[{src:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="coral"/></svg>'),aspect:4/3,caption:'照片'}]}],onShow(){},onCovered(){},onHide(){}});view.open(0);`});
    await page.locator('#story.unfolded').waitFor();
    assert.equal(await page.locator('.shot').first().evaluate(el=>el.getBoundingClientRect().width),419,'桌面照片从524px缩小20%，四舍五入至419px');
    const heading=await page.locator('#story-title').evaluate(el=>({top:el.getBoundingClientRect().top,font:getComputedStyle(el).fontFamily,spacing:parseFloat(getComputedStyle(el).letterSpacing)}));
    assert.ok(heading.top>=46&&heading.top<=50,'标题应从68px上移约20px');
    assert.match(heading.font,/SimSun|STSong/,'城市标题使用宋体风格');
    assert.ok(heading.spacing>=2,'城市标题增加舒展的字间距');
    assert.equal(await page.locator('.story-backdrop canvas').count(),1,'星空只在城市页面的底层');
    await page.waitForFunction(()=>window.starPixels>100);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'travel-city-galaxy.png')});
    assert.equal(await page.locator('.story-backdrop canvas').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
    await page.keyboard.press('Space');
    const stopped=await page.evaluate(()=>window.draws);await page.waitForTimeout(150);
    assert.equal(await page.evaluate(()=>window.draws),stopped,'空格暂停星空');
    await page.keyboard.press('Space');await page.waitForFunction(n=>window.draws>n,stopped);
    await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
    const cached=await page.evaluate(()=>window.draws);
    await page.waitForFunction(n=>window.draws>n,cached,{timeout:3000});
    await page.evaluate(()=>view.openLightbox(0));
    const covered=await page.evaluate(()=>window.draws);await page.waitForTimeout(150);
    assert.equal(await page.evaluate(()=>window.draws),covered,'大图覆盖时不绘制星空');
    await page.evaluate(()=>view.closeLightbox(true));
    await page.waitForFunction(n=>window.draws>n,covered);
    await page.setViewportSize({width:390,height:900});
    const width=await page.locator('.shot').first().evaluate(el=>el.getBoundingClientRect().width);
    assert.equal(width,287,'手机照片从358.8px缩小20%，四舍五入至287px');
    await page.evaluate(()=>view.close());
    const closed=await page.evaluate(()=>window.draws);await page.waitForTimeout(150);
    assert.equal(await page.evaluate(()=>window.draws),closed,'返回后停止绘制');
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
test('减少动态效果时星空静止，WebGL不可用时仍能浏览城市照片',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    for(const fallback of [false,true]){
      const page=await browser.newPage({reducedMotion:'reduce'});
      await page.setContent(fs.readFileSync(path.join(root,'template.html'),'utf8').replace('<link rel="stylesheet" href="./style.css">','<style>'+fs.readFileSync(path.join(root,'style.css'),'utf8')+'</style>'));
      await page.evaluate(fallback=>{
        window.draws=0;
        if(fallback){const context=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:context.call(this,type,...args);};}
        const draw=WebGLRenderingContext.prototype.drawArrays;
        WebGLRenderingContext.prototype.drawArrays=function(...args){window.draws++;return draw.apply(this,args);};
      },fallback);
      const source=['math','galaxy','story'].map(name=>fs.readFileSync(path.join(root,'js',name+'.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n');
      await page.addScriptTag({content:source+`\nwindow.view=new StoryView({stories:[{id:'city',title:'洛阳市',rgb:'125 140 255',chapters:[{src:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"/>'),aspect:4/3}]}],onShow(){},onCovered(){},onHide(){}});view.open(0);`});
      await page.locator('#story.unfolded').waitFor();
      if(!fallback)await page.waitForFunction(()=>window.draws>0);
      const draws=await page.evaluate(()=>window.draws);await page.waitForTimeout(150);
      assert.equal(await page.evaluate(()=>window.draws),draws,'减少动画时只绘制静态星空');
      assert.equal(await page.locator('.story-backdrop canvas').count(),fallback?0:1);
      await page.evaluate(()=>view.openLightbox(0));await page.locator('.lightbox').waitFor();
      await page.evaluate(()=>{view.closeLightbox(true);view.close();});
      await page.locator('#story').waitFor({state:'hidden'});await page.close();
    }
  }finally{await browser.close();}
});
