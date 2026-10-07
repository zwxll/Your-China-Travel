const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('总览有蓝紫粉Lightfall底景，暂停同步且城市星空与目录可用',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setContent('<body></body>');
    await page.addScriptTag({path:path.resolve('assets/photo-stream/embedded.js')});
    await page.evaluate(()=>{
      const src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/></svg>');
      window.TravelPhotoStreamBridge={readCatalog:async()=>({photos:Array.from({length:12},(_,i)=>({id:String(i),cityKey:'city'+i,city:'城市'+i,src,description:'照片'+i})),failed:0})};
      const iframe=document.createElement('iframe');iframe.style='position:fixed;inset:0;border:0;width:100%;height:100%';
      const probe=`<script>
      window.lightfallTimes=[];
      const names=new WeakMap(),proto=WebGL2RenderingContext.prototype;
      const getLoc=proto.getUniformLocation,uniform=proto.uniform1f,context=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(type,options){return context.call(this,type,{...options,preserveDrawingBuffer:true});};
      proto.getUniformLocation=function(p,n){const loc=getLoc.call(this,p,n);if(loc)names.set(loc,n);return loc;};
      proto.uniform1f=function(loc,value){if(names.get(loc)==='uLightfallTime')window.lightfallTimes.push(value);return uniform.call(this,loc,value);};
      <\/script>`;
      iframe.srcdoc=window.TravelPhotoStreamDocument.replace('<head>','<head>'+probe);document.body.append(iframe);
    });
    await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow.document.readyState==='complete');
    const frame=page.frames().find(f=>f!==page.mainFrame());
    page.on('console',msg=>{if(msg.type()==='error')console.log(msg.text());});
    await frame.waitForFunction(()=>window.__undertow,{},{timeout:30000});
    assert.ok(await frame.evaluate(()=>window.lightfallTimes.length>0),'总览应实际绘制Lightfall，而不是只有原光瀑');
    const colorPixels=await frame.evaluate(()=>{
      const canvas=document.querySelector('#stream'),gl=canvas.getContext('webgl2'),pixels=new Uint8Array(120*canvas.height*4);
      gl.readPixels(0,0,120,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      let count=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+2]>20&&pixels[i+2]>pixels[i+1]*1.4)count++;
      return count;
    });
    assert.ok(colorPixels>100,'照片之外的背景应可见蓝紫色光效');
    await page.waitForTimeout(3500); // Allow the existing curtain-opening animation to finish for visual inspection.
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'travel-lightfall-overview.png')});
    await frame.locator('#stream').focus();await page.keyboard.press('Space');
    const stopped=await frame.evaluate(()=>window.lightfallTimes.at(-1));await page.waitForTimeout(150);
    assert.equal(await frame.evaluate(()=>window.lightfallTimes.at(-1)),stopped,'空格暂停背景时间');
    await page.keyboard.press('Space');await frame.waitForFunction(t=>window.lightfallTimes.at(-1)>t,stopped);
    await frame.locator('#directory-toggle').click();await frame.locator('.directory-grid button').first().click();
    await frame.locator('#story.unfolded').waitFor();await frame.locator('.story-backdrop canvas').waitFor();
    await page.waitForTimeout(1200);
    const covered=await frame.evaluate(()=>window.lightfallTimes.length);await page.waitForTimeout(150);
    assert.equal(await frame.evaluate(()=>window.lightfallTimes.length),covered,'城市相册显示时不绘制总览背景');
    await frame.locator('.story-back').click();await frame.locator('#story').waitFor({state:'hidden'});
    await frame.waitForFunction(n=>window.lightfallTimes.length>n,covered);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
