const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const bridge=html.slice(html.indexOf('  // 照片流只读取现有资料'),html.indexOf("  document.addEventListener('click',event=>{if(event.target.closest('#memoryShelfBtn'))"));
const fixture=`<!doctype html><body><script src="assets/photo-stream/embedded.js"></script><button id="photoStreamBtn">照片流</button><div id="photoStreamOverlay" hidden><button id="photoStreamClose">关闭</button><div id="photoStreamStage" style="height:760px"></div></div><script>
const $=id=>document.getElementById(id), appStartPromise=Promise.resolve();
const canvas=document.createElement('canvas');canvas.width=canvas.height=32;const ctx=canvas.getContext('2d');
let records=Array.from({length:51},(_,i)=>{ctx.fillStyle='hsl('+i*7+',70%,55%)';ctx.fillRect(0,0,32,32);return {id:i,cityKey:'city-1',cityName:'孝感市',name:'照片 '+i,dataUrl:canvas.toDataURL(),order:i};});
const extra={dataUrl:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="red"/></svg>'),name:'景点照片'};
const getAllPhotos=async()=>records,getAllCityMeta=async()=>supplemental?[{cityKey:'city-1',coverImage:records.find(p=>p.kind!=='video')?.dataUrl,attractions:[{name:'景点',photos:[records[0],extra],notes:'真实笔记',visitDate:'2026-09-01'}]}]:[];
let provinceBooks={},supplemental=true;
const memoryProvinceBookSettings=()=>provinceBooks;
const cityPoints=[{cityKey:'city-1',name:'孝感市'}],getVisitMonths=()=>[],downloadCloudImage=async path=>{if(path==='saved-cloud-photo')return extra.dataUrl;throw Error('测试下载失败');};
${bridge}</script></body>`;
const server=http.createServer((req,res)=>{
  if(req.url==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(fixture);}
  const file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)){res.statusCode=403;return res.end();}
  fs.readFile(file,(err,data)=>{if(err){res.statusCode=404;return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data);});
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const fileMode=process.env.PHOTO_STREAM_MODE==='file';
  const tempDir=fileMode?fs.mkdtempSync(path.join(require('node:os').tmpdir(),'travel-photo-stream-file-')):null;
  if(fileMode)fs.writeFileSync(path.join(tempDir,'index.html'),fixture.replace('<body>','<head><base href="'+pathToFileURL(root+path.sep).href+'"></head><body>'));
  const entryUrl=fileMode?pathToFileURL(path.join(tempDir,'index.html')).href:'http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:2,reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(entryUrl);
    await page.getByRole('button',{name:'照片流',exact:true}).click();
    const frame=()=>page.frames().find(frame=>frame!==page.mainFrame());
    const ready=()=>page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow.__undertow,{},{timeout:45000});
    const waitForMotion=async stopped=>{
      await frame().evaluate(()=>{window.__spaceMotion=null;});
      await frame().waitForFunction(stopped=>{
        const flow=window.__undertow.fib.flow[0],time=performance.now(),last=window.__spaceMotion;
        window.__spaceMotion={flow,time};
        return last&&time>last.time&&((flow-last.flow)/(time-last.time)<.00002)===stopped;
      },stopped,{polling:'raf',timeout:10000});
    };
    await ready();
    await waitForMotion(false);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'photoStreamClose');
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#photoStreamOverlay').isVisible(),true,'打开后空格不能误触当前获得焦点的关闭按钮');
    await waitForMotion(true);
    await page.keyboard.press('Tab');await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    assert.equal(await page.locator('iframe').count(),1,'Tab返回关闭按钮后空格仍不能销毁照片流');
    await waitForMotion(false);
    await page.keyboard.down('Space');await page.keyboard.down('Space');await page.keyboard.up('Space');
    await waitForMotion(true);
    await frame().locator('#stream').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#photoStreamOverlay').isVisible(),true,'照片流画布中的空格保留原操作，不关闭外层页面');
    await waitForMotion(false);
    await page.keyboard.down('Space');await page.keyboard.down('Space');await page.keyboard.up('Space');
    await waitForMotion(true);
    await page.locator('#photoStreamClose').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('iframe').count(),0,'关闭按钮仍支持Enter正常关闭');
    await page.getByRole('button',{name:'照片流',exact:true}).click();await ready();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('iframe').count(),0,'Escape仍可正常关闭');
    await page.getByRole('button',{name:'照片流',exact:true}).click();await ready();
    console.log('PASS: 空格不误关闭、Tab切换后仍安全、Enter及Escape正常关闭');
    assert.equal(frame().url(),'about:srcdoc','所有入口统一使用内嵌照片流，不再打开旧HTML模块入口');
    assert.ok(await frame().evaluate(()=>{const canvas=document.querySelector('#stream');return canvas.width*canvas.height<=1503000;}),'高分屏光效画布应限制像素开销');
    const idleLabelMutations=await frame().evaluate(async()=>{
      const {cam,LS_MIN}=window.__undertow;
      cam.x=0;cam.y=6.4;cam.vx=cam.vy=0;cam.ls=cam.lsT=LS_MIN();
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      let mutations=0;
      const observer=new MutationObserver(records=>{mutations+=records.length;});
      observer.observe(document.querySelector('#city-labels'),{subtree:true,attributes:true});
      for(let i=0;i<8;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
      observer.disconnect();return mutations;
    });
    assert.equal(idleLabelMutations,0,'镜头不动时不应反复写入城市名称样式');
    await frame().evaluate(()=>window.__undertow.zoomBy(.8,640,380));
    await frame().waitForFunction(()=>Math.abs(window.__undertow.cam.ls-window.__undertow.cam.lsT)<.01);
    const beforeDrag=await frame().evaluate(()=>({x:window.__undertow.cam.x,y:window.__undertow.cam.y}));
    await page.mouse.move(640,400);await page.mouse.down();
    await page.mouse.move(730,430,{steps:8});await page.mouse.up();
    await frame().waitForFunction(({x,y})=>Math.hypot(window.__undertow.cam.x-x,window.__undertow.cam.y-y)>.05,beforeDrag);
    await frame().waitForFunction(()=>{const rect=document.querySelector('#city-labels span').getBoundingClientRect();return Math.abs(rect.x+rect.width/2-window.__undertow.project(window.__undertow.fib.x0[0],15).x)<2;});
    console.log('PASS: 高分屏渲染像素预算、静止标签零重复更新、缩放拖动与名称对齐');
    assert.equal(await frame().locator('#photo-count').textContent(),'1 座城市 · 51 张照片');
    assert.equal(await frame().locator('.directory-grid button').count(),51);
    assert.equal(await frame().evaluate(()=>window.__undertow.stories.length),1,'一座城市只有一条光线');
    assert.equal(await frame().locator('#city-labels span').textContent(),'孝感市','光线顶部显示真实城市名');
    const cityText=await frame().locator('#city-labels span').evaluate(label=>{
      const style=getComputedStyle(label),[r,g,b,a=1]=style.color.match(/[\d.]+/g).map(Number);
      return {size:parseFloat(style.fontSize),alpha:a,brightness:(r+g+b)/3,blue:b};
    });
    assert.ok(cityText.size>=14,'横排城市名称放大后应更容易阅读');
    assert.ok(cityText.alpha>=.6&&cityText.alpha<=.7&&cityText.brightness>=235&&cityText.blue>=250,'城市名称使用柔和但清楚的浅蓝白色');
    assert.equal(await frame().evaluate(()=>window.__undertow.stories[0].chapters.length),51,'单城超过8/48张不截断');
    assert.equal(await frame().locator('#batch-next').count(),0,'取消批次切换');
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'travel-photo-stream-desktop.png')});
    await frame().locator('#directory-toggle').click();
    await frame().locator('.directory-grid button').first().click();
    await frame().locator('#story.unfolded').waitFor();
    assert.equal(await frame().locator('#story-title').textContent(),'孝感市');
    for(const width of [1280,390]){
      await page.setViewportSize({width,height:900});
      for(const name of ['孝感市','克孜勒苏柯尔克孜自治州']){
        const heading=await frame().evaluate(name=>{
          const title=document.querySelector('#story-title');title.textContent=name;
          const rect=title.getBoundingClientRect(),back=document.querySelector('.story-back').getBoundingClientRect(),style=getComputedStyle(title);
          return {center:rect.x+rect.width/2,screen:innerWidth,left:rect.left,right:rect.right,bottom:rect.bottom,
            flowTop:document.querySelector('.story-flow').getBoundingClientRect().top,backRight:back.right,
            size:parseFloat(style.fontSize),weight:+style.fontWeight,italic:style.fontStyle,alpha:+style.color.match(/[\d.]+/g)[3]};
        },name);
        assert.ok(Math.abs(heading.center-heading.screen/2)<2,'城市标题应与照片列顶部居中对齐');
        assert.ok(heading.flowTop>=heading.bottom+4,'照片显示区域应位于城市标题下方');
        assert.ok(heading.size>=20&&heading.weight>=600&&heading.italic==='normal'&&heading.alpha>=.85,'城市标题应放大、加粗并清晰显示');
        assert.ok(heading.left>heading.backRight&&heading.right<heading.screen,'手机长城市标题不覆盖返回按钮或溢出屏幕');
      }
    }
    await frame().evaluate(()=>{document.querySelector('#story-title').textContent='孝感市';});
    await page.setViewportSize({width:1280,height:900});
    await frame().waitForFunction(()=>[...document.querySelectorAll('.shot')].some(shot=>{const r=shot.getBoundingClientRect();return r.top>document.querySelector('.story-flow').getBoundingClientRect().top&&r.bottom<innerHeight-50;}));
    const visibleShot=await frame().evaluate(()=>[...document.querySelectorAll('.shot')].findIndex(shot=>{const r=shot.getBoundingClientRect();return r.top>document.querySelector('.story-flow').getBoundingClientRect().top&&r.bottom<innerHeight-50;}));
    await frame().locator('.shot').nth(visibleShot).click();
    await frame().locator('.lightbox').waitFor({state:'visible'});
    await frame().locator('.lightbox').click();
    await frame().locator('.story-back').click();
    await frame().locator('#story').waitFor({state:'hidden'});
    await frame().locator('#directory-toggle').click();
    await frame().locator('.directory-grid button').last().click();
    await frame().locator('#story.unfolded').waitFor();
    await frame().waitForFunction(()=>[...document.querySelectorAll('.shot[data-i="50"]')].some(shot=>{const r=shot.getBoundingClientRect();return r.top>0&&r.bottom<innerHeight;}));
    assert.equal(await frame().evaluate(()=>window.__undertow.stories[0].chapters[50].text),'');
    await page.getByRole('button',{name:'关闭',exact:true}).click();
    assert.equal(await page.locator('iframe').count(),0,'关闭后销毁渲染器');
    console.log('PASS: 一城一线、51张相册照片完整覆盖、不额外加入景点照片和封面、目录定位最后一张、原图放大、关闭释放');
    await page.evaluate(()=>{records=[{id:100,kind:'video',dataUrl:'data:video/mp4;base64,AAA'},{...records[1],id:101}];});
    await page.getByRole('button',{name:'照片流',exact:true}).click();
    const catalog=await page.evaluate(()=>window.TravelPhotoStreamBridge.readCatalog());
    assert.equal(catalog.total,1,'仅导入城市相册图片，排除视频和额外景点照片');
    await ready();
    await page.getByRole('button',{name:'关闭',exact:true}).click();
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('button',{name:'照片流',exact:true}).click();
    await ready();
    assert.equal(await frame().evaluate(()=>document.querySelector('.stream-toolbar').getBoundingClientRect().right>innerWidth),false);
    console.log('PASS: 手机光瀑渲染及工具栏无溢出');
    await page.getByRole('button',{name:'关闭',exact:true}).click();
    await page.evaluate(()=>{
      const coverCanvas=document.createElement('canvas');coverCanvas.width=coverCanvas.height=19;
      provinceBooks={'湖北省':{cover:coverCanvas.toDataURL(),review:'用户封面寄语'}};
      records=[{...records[1],id:500},{id:500,cityKey:'city-1',storagePath:'saved-cloud-photo',name:'云端照片'}];
    });
    await page.getByRole('button',{name:'照片流',exact:true}).click();
    const sources=await page.evaluate(()=>window.TravelPhotoStreamBridge.readCatalog());
    assert.equal(sources.total,2,'不同照片同ID不丢失，不混入独立封面和景点照片');
    assert.ok(sources.photos.some(p=>p.description.includes('云端照片')&&p.src.startsWith('data:image/')));
    assert.ok(sources.photos.every(p=>p.cityKey==='city-1'));
    console.log('PASS: 仅使用主页相册数据，云端照片正常读取');
    await page.getByRole('button',{name:'关闭',exact:true}).click();
    await page.evaluate(()=>{supplemental=false;const src=records.find(photo=>photo.dataUrl).dataUrl;records=Array.from({length:60},(_,i)=>({id:i,cityKey:'city-'+i,cityName:'城市'+i,dataUrl:src}));});
    await page.getByRole('button',{name:'照片流',exact:true}).click();
    await ready();
    assert.equal(await frame().evaluate(()=>window.__undertow.stories.length),60);
    assert.equal(await frame().evaluate(()=>window.__undertow.fib.x0.length),60,'光线状态按实际城市数分配');
    assert.equal(await frame().locator('#city-labels span').count(),60,'每条城市光线对应一个名称');
    assert.equal(await frame().locator('#city-labels span').last().textContent(),'城市59');
    await frame().locator('#city-labels span.vertical').first().waitFor();
    assert.ok(await frame().locator('#city-labels span.vertical').first().evaluate(label=>parseFloat(getComputedStyle(label).fontSize)>=13),'密集城市的竖排名称同样放大');
    for(const width of [390,1280]){
    await page.setViewportSize({width,height:900});
    const minimumMotion=await frame().evaluate(async()=>{
      const {cam,fib,LS_MIN}=window.__undertow,canvas=document.querySelector('#stream');
      canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:5000,clientX:innerWidth*.7,clientY:innerHeight*.5,cancelable:true}));
      while(Math.abs(cam.ls-LS_MIN())>.0001)await new Promise(resolve=>requestAnimationFrame(resolve));
      let camera=0,photos=0;
      for(let i=0;i<48;i++){
        const x=innerWidth*(i%2?.7:.3),y=innerHeight*.5;
        canvas.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y,pointerType:'mouse'}));
        canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:200,clientX:x,clientY:y,cancelable:true}));
        await new Promise(resolve=>requestAnimationFrame(resolve));
        camera=Math.max(camera,Math.abs(cam.x)*Math.exp(cam.ls));
        photos=Math.max(photos,...Array.from(fib.o,value=>Math.abs(value)*Math.exp(cam.ls)));
      }
      canvas.dispatchEvent(new WheelEvent('wheel',{deltaY:-300,clientX:innerWidth*.5,clientY:innerHeight*.5,cancelable:true}));
      while(Math.abs(cam.ls-cam.lsT)>.0001)await new Promise(resolve=>requestAnimationFrame(resolve));
      let enlarged=0;
      for(let i=0;i<24;i++){
        canvas.dispatchEvent(new PointerEvent('pointermove',{clientX:innerWidth*(i%2?.7:.3),clientY:innerHeight*.5,pointerType:'mouse'}));
        await new Promise(resolve=>requestAnimationFrame(resolve));
        enlarged=Math.max(enlarged,...Array.from(fib.o,value=>Math.abs(value)*Math.exp(cam.ls)));
      }
      return {camera,photos,enlarged};
    });
    console.log('最小缩放横向偏移（像素）:',minimumMotion);
    assert.ok(minimumMotion.camera<1&&minimumMotion.photos<1,'最小缩放下继续滚轮并移动鼠标，不应横向推挤照片或移动镜头');
    assert.ok(minimumMotion.enlarged>1,'重新放大后保留原有鼠标推挤交互');
    }
    await frame().waitForFunction(()=>{
      const label=document.querySelector('#city-labels span:last-child');
      const rect=label.getBoundingClientRect();
      return Math.abs(rect.x+rect.width/2-window.__undertow.project(window.__undertow.fib.x0[59],15).x)<2;
    });
    assert.equal(await frame().evaluate(()=>window.__undertow.stories.every(s=>s.chapters.length===1)),true);
    await frame().locator('#directory-toggle').click();
    await frame().locator('.directory-grid button').last().click();
    await frame().locator('#story.unfolded').waitFor();
    assert.equal(await frame().locator('#story-title').textContent(),'城市59');
    assert.equal(errors.length,0,errors.join('\n'));
    console.log('PASS: 60座城市生成60条光线、跨城市同图保留、目录定位正确城市');
    await page.getByRole('button',{name:'关闭',exact:true}).click();
    await page.evaluate(()=>{supplemental=true;const src=records[0].dataUrl;records=Array.from({length:159},(_,i)=>({id:i,cityKey:'city-1',cityName:'孝感市',dataUrl:src}));});
    await page.getByRole('button',{name:'照片流',exact:true}).click();
    assert.equal((await page.evaluate(()=>window.TravelPhotoStreamBridge.readCatalog())).total,159,'主页159条相册记录全部保留，不按图片内容去重');
    console.log('PASS: 主页159张对应照片流159张');
    await page.getByRole('button',{name:'关闭',exact:true}).click();
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.evaluate(()=>{records=records.slice(0,2);});
    await page.getByRole('button',{name:'照片流',exact:true}).click();await ready();
    await frame().locator('#directory-toggle').click();
    await frame().locator('.directory-grid button').first().click();
    await frame().locator('#story.unfolded').waitFor();
    const waitForStoryMotion=async stopped=>assert.equal(await frame().evaluate(async stopped=>{
      const item=document.querySelector('.item'),deadline=performance.now()+10000;
      let settled=false;
      do{
        const y=new DOMMatrixReadOnly(getComputedStyle(item).transform).m42,start=performance.now();
        for(let i=0;i<12;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
        const speed=Math.abs(new DOMMatrixReadOnly(getComputedStyle(item).transform).m42-y)/(performance.now()-start);
        settled=(speed<.001)===stopped;
      }while(!settled&&performance.now()<deadline);
      return settled;
    },stopped),true,'城市相册内的空格应切换真实照片运动');
    await page.locator('#photoStreamClose').focus();await waitForStoryMotion(false);
    await page.keyboard.press('Space');await waitForStoryMotion(true);
    await frame().locator('.story-back').focus();
    await page.keyboard.press('Space');await waitForStoryMotion(false);
    await page.keyboard.down('Space');await page.keyboard.down('Space');await page.keyboard.up('Space');
    await waitForStoryMotion(true);
    assert.equal(await page.locator('#photoStreamOverlay').isVisible(),true);
    assert.equal(await frame().locator('#story').isVisible(),true);
    console.log('PASS: 城市相册内外焦点均可空格暂停/继续，长按只切换一次');
    await page.getByRole('button',{name:'关闭',exact:true}).click();
    const fallback=await browser.newPage();
    await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args);};});
    await fallback.goto(entryUrl);
    await fallback.getByRole('button',{name:'照片流',exact:true}).click();
    await fallback.frameLocator('iframe').locator('#photo-directory').waitFor({state:'visible'});
    await fallback.frameLocator('iframe').locator('.directory-grid button').first().click();
    await fallback.frameLocator('iframe').locator('#fallback-preview').waitFor({state:'visible'});
    console.log('PASS: 无WebGL设备可查看全部照片');
    console.log('PASS: '+(fileMode?'file:// 双击文件入口':'HTTP 网页入口'));
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));if(tempDir)fs.rmSync(tempDir,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
