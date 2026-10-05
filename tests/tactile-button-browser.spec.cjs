const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const styles=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
const markup=html.match(/<button id="lifeImageAtlasBtn"[\s\S]*?<\/button>/)[0];
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
