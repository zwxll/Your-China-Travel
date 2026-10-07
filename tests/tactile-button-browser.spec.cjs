const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const styles=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
const markup=html.match(/<button id="lifeImageAtlasBtn"[\s\S]*?<\/button>/)[0];
test('年轮、照片墙和伞幕三个入口共用液体光效与交互样式',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({reducedMotion:'reduce'}),ids=['lifeImageAtlasBtn','lifePhotoWallBtn','lifeCanopyBtn'];
    const archiveStart=html.indexOf('  <div id="journeyArchiveOverlay"'),archiveEnd=html.indexOf('  <div id="imageAtlasOverlay"',archiveStart);
    await page.setContent('<style>'+styles+'</style>'+html.slice(archiveStart,archiveEnd));
    await page.evaluate(ids=>{
      document.getElementById('journeyArchiveOverlay').classList.add('show','life-mode');
      document.getElementById('journeyArchiveBody').innerHTML='<section class="life-photo-dome"><div class="life-photo-dome-head"><div><b>旅途影像</b><span>按时间轴城市顺序汇集</span></div><div class="life-photo-dome-actions"><em>164 张照片 · 拖动浏览</em></div></div></section>';
      const actions=document.querySelector('.life-photo-dome-actions');
      ids.forEach(id=>actions.append(document.getElementById(id)));
    },ids);
    for(const width of [1280,390]){
      await page.setViewportSize({width,height:844});
      await page.evaluate(ids=>ids.forEach(id=>document.getElementById(id).hidden=false),ids);
      for(const id of ids){const box=await page.locator('#'+id).boundingBox();assert.ok(box.x+box.width<=width,'三个一致按钮在手机与桌面不溢出');}
    }
    await page.setViewportSize({width:1280,height:844});
    await page.evaluate(ids=>ids.forEach(id=>document.getElementById(id).hidden=false),ids);
    for(const id of ids){
      assert.equal(await page.locator('#'+id+' canvas').count(),1,id+'必须拥有相同液体画布');
      assert.equal(await page.locator('#'+id+' svg').count(),1,id+'使用相同尺寸图标');
    }
    await page.addScriptTag({path:path.join(__dirname,'../assets/tactile-button.js')});
    const start=html.indexOf('  const lifeAtlasEffect='),end=html.indexOf('  let imageAtlasFrame=',start);
    await page.evaluate(`const lifeImageAtlasBtnEl=document.getElementById('lifeImageAtlasBtn'),lifePhotoWallBtnEl=document.getElementById('lifePhotoWallBtn'),lifeCanopyBtnEl=document.getElementById('lifeCanopyBtn');${html.slice(start,end)}`);
    await page.waitForFunction(()=>[...document.querySelectorAll('button canvas')].every(c=>{const gl=c.getContext('webgl');return gl.getParameter(gl.CURRENT_PROGRAM)&&c.width===c.parentElement.clientWidth*devicePixelRatio;}));
    for(const state of ['normal','hover','pressed']){
      const values=[];
      for(const id of ids){
        const button=page.locator('#'+id);
        await page.mouse.move(1,200);
        if(state!=='normal')await button.hover();
        if(state==='pressed')await page.mouse.down();
        await page.waitForTimeout(230);
        values.push(await button.evaluate(el=>{const c=getComputedStyle(el),gl=el.querySelector('canvas').getContext('webgl'),p=gl.getParameter(gl.CURRENT_PROGRAM);return {background:c.background,border:c.border,radius:c.borderRadius,color:c.color,font:c.font,padding:c.padding,shadow:c.boxShadow,transform:c.transform,height:el.offsetHeight,icon:getComputedStyle(el.querySelector('svg')).width,level:gl.getUniform(p,gl.getUniformLocation(p,'u_level'))};}));
        if(state==='pressed')await page.mouse.up();
      }
      assert.deepEqual(values[1],values[0],'照片墙'+state+'复用年轮效果');
      assert.deepEqual(values[2],values[0],'伞幕'+state+'复用年轮效果');
    }
  }finally{await browser.close();}
});
async function setup(page,noGL=false){
  await page.setContent('<style>'+styles+'</style><div id="holder">'+markup+'</div>');
  await page.evaluate(noGL=>{
    document.getElementById('lifeImageAtlasBtn').hidden=false;
    window.draws=0;
    if(noGL)HTMLCanvasElement.prototype.getContext=()=>null;
    else{
      const draw=WebGLRenderingContext.prototype.drawArrays;
      WebGLRenderingContext.prototype.drawArrays=function(...args){window.draws++;return draw.apply(this,args);};
    }
  },noGL);
  assert.equal(await page.locator('#lifeImageAtlasBtn canvas').count(),1,'液体效果只在按钮内部渲染');
  await page.addScriptTag({path:path.join(__dirname,'../assets/tactile-button.js')});
  await page.evaluate(()=>{window.effect=window.initTactileButton(document.getElementById('lifeImageAtlasBtn'));});
}
test('液体按钮实际渲染，隐藏/禁用停止绘制，恢复继续，鼠标按压不影响按钮点击',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await setup(page);await page.waitForFunction(()=>window.draws>2);
    const button=page.locator('#lifeImageAtlasBtn');
    const uniform=name=>page.evaluate(name=>{
      const gl=document.querySelector('#lifeImageAtlasBtn canvas').getContext('webgl'),program=gl.getParameter(gl.CURRENT_PROGRAM);
      return gl.getUniform(program,gl.getUniformLocation(program,name));
    },name);
    await button.evaluate(el=>el.addEventListener('click',()=>window.clicked=true));
    await button.hover();const box=await button.boundingBox();
    await page.mouse.move(box.x+box.width-8,box.y+box.height/2);await page.waitForTimeout(120);
    assert.ok(await uniform('u_tilt')>0,'鼠标移动向右带动液面倾斜');
    await page.mouse.down();
    assert.notEqual(await button.evaluate(el=>getComputedStyle(el).transform),'none','按下有触觉位移');
    await page.mouse.up();assert.equal(await page.evaluate(()=>window.clicked),true);
    await page.waitForTimeout(120);assert.ok(await uniform('u_level')<.55,'点击后液面下降');
    await page.evaluate(()=>window.effect.setActive(false));const stopped=await page.evaluate(()=>window.draws);
    await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.draws),stopped,'覆盖按钮时停止动画');
    await page.evaluate(()=>window.effect.setActive(true));await page.waitForFunction(n=>window.draws>n,stopped);
    await page.evaluate(()=>document.getElementById('holder').style.display='none');await page.waitForTimeout(100);
    const hidden=await page.evaluate(()=>window.draws);await page.waitForTimeout(150);
    assert.equal(await page.evaluate(()=>window.draws),hidden,'隐藏时不持续请求绘制');
    await page.evaluate(()=>document.getElementById('holder').style.display='block');await page.waitForFunction(n=>window.draws>n,hidden);
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
test('无WebGL使用静态渐变且点击可用，减少动态效果时不持续绘制',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const fallback=await browser.newPage();await setup(fallback,true);
    assert.equal(await fallback.locator('#lifeImageAtlasBtn canvas').isVisible(),false);
    assert.notEqual(await fallback.locator('#lifeImageAtlasBtn').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
    await fallback.locator('#lifeImageAtlasBtn').evaluate(el=>el.addEventListener('click',()=>window.clicked=true));
    await fallback.locator('#lifeImageAtlasBtn').click();assert.equal(await fallback.evaluate(()=>window.clicked),true);
    const reduced=await browser.newPage({reducedMotion:'reduce'});await setup(reduced);
    await reduced.waitForFunction(()=>window.draws>0);await reduced.waitForTimeout(100);
    const draws=await reduced.evaluate(()=>window.draws);await reduced.waitForTimeout(150);
    assert.equal(await reduced.evaluate(()=>window.draws),draws,'减少动态效果只绘制静态液面');
  }finally{await browser.close();}
});
