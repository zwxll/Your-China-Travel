const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {PNG}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
test('提供版本的完整阅读器：本地封面、翻页、照片点击、构图、触摸取消及销毁',async()=>{
  const browser=await chromium.launch({channel:process.env.ALBUM_TEST_BROWSER||'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'travel-reader-test-'));
  try{
    const source=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
    const script=pathToFileURL(path.resolve(__dirname,'../assets/vendor/album-3d.js')).href;
    fs.writeFileSync(path.join(folder,'index.html'),'<meta charset="utf-8">'+source.match(/<style[\s\S]*?<\/style>/g).join('')+'<script src="'+script+'"></script><div style="height:780px"><div class="memory-album"><div class="memory-view-tools"><button class="memory-back">返回省份</button><div class="memory-view-title"><span>旅行照片册</span><h3>测试城</h3></div><button class="memory-city-detail">城市详情</button></div><div class="memory-album-frame"><button class="memory-album-side prev" id="memoryAlbumPrev">‹</button><div class="memory-album-stage" id="memoryAlbumStage"></div><button class="memory-album-side next" id="memoryAlbumNext">›</button><span class="memory-album-counter" id="memoryAlbumCounter"></span></div></div></div>');
    const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
    await page.emulateMedia({reducedMotion:'no-preference'});
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
    const start=source.indexOf('  async function memoryPrepareAlbumPhotos('),end=source.indexOf('  async function memoryOpenAlbum(');
    await page.addScriptTag({content:`const $=id=>document.getElementById(id),escapeHtml=x=>x,formatMonth=x=>x;
      const memoryShelfState={level:'album',city:{name:'测试城',meta:{}},photos:[],page:0,wheelAt:0,photoPositions:new Map()};
      let viewed=-1;const openPhotoViewer=(photos,index)=>viewed=index;
      ${source.slice(start,end)}
      const dataUrl='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#819eaa"/><circle cx="450" cy="100" r="60" fill="#e6d9bb"/></svg>');
      memoryShelfState.photos=Array.from({length:8},()=>({dataUrl}));
      (async()=>{await memoryPrepareAlbumPhotos(memoryShelfState.photos);await memoryStartAlbum3D();})();
      $('memoryAlbumNext').onclick=()=>memoryTurnAlbum(1);$('memoryAlbumPrev').onclick=()=>memoryTurnAlbum(-1);`});
    await page.evaluate(()=>$('memoryAlbumStage').addEventListener('wheel',memoryAlbumStageWheel,{passive:false}));
    await page.waitForFunction(()=>document.querySelector('#memoryAlbumCounter').textContent==='封面',{timeout:15000});
    const paper=await page.evaluate(()=>{
      const canvas=document.createElement('canvas');canvas.width=600;canvas.height=650;
      const ctx=canvas.getContext('2d');memoryAlbumPaintPaper({ctx,W:600,H:650,S:1},'cover-front');
      return Array.from({length:50},(_,i)=>Array.from(ctx.getImageData(100,100+i,1,1).data).join(','));
    });
    assert.equal(new Set(paper).size,1,'纸张平坦区域不应有可见条纹');
    assert.ok((await page.locator('#memoryAlbumStage').boundingBox()).height>=650,'780px阅读区域应给书本至少650px舞台');
    await page.locator('#memoryAlbumNext').click();
    assert.equal(await page.locator('#memoryAlbumNext').isDisabled(),true,'正常翻页期间按钮必须锁定');
    await page.evaluate(()=>memoryTurnAlbum(1));
    assert.equal(await page.locator('#memoryAlbumCounter').innerText(),'封面','动画完成前页码保持原页，连续命令不能提前更新');
    await page.waitForFunction(()=>memoryShelfState.page===0&&memoryAlbum3DState.reader.isReady()&&!document.querySelector('#memoryAlbumNext').disabled&&document.querySelector('#memoryAlbumCounter').textContent==='01 / 03');
    await page.waitForTimeout(1600);
    const rect=await page.locator('.memory-album-3d-canvas').boundingBox();
    const counter=await page.locator('#memoryAlbumCounter').boundingBox(),prev=await page.locator('#memoryAlbumPrev').boundingBox(),next=await page.locator('#memoryAlbumNext').boundingBox();
    assert.ok(counter.y>=rect.y+rect.height,'页码位于书页舞台下方');
    assert.ok(prev.x+prev.width<=rect.x&&next.x>=rect.x+rect.width,'桌面翻页按钮留在书页外侧');
    // 正交取景保留少量弯曲边距，标题在舞台外。
    const ph=Math.min(rect.height/1.04,rect.width/(2*.86*1.025)),pw=ph*.86,cx=rect.x+rect.width/2,cy=rect.y+rect.height*.51;
    await page.screenshot({path:path.join(os.tmpdir(),'travel-imported-open.png')});
    // 未按下鼠标时的页缘预览不能偷偷把旧纸页抬起，再污染按钮/滚轮动画起点。
    await page.mouse.move(cx,cy);await page.waitForTimeout(1000);
    const idle=await page.locator('.memory-album-3d-canvas').screenshot();
    await page.mouse.move(cx-pw*.99,cy-ph*.46);await page.waitForTimeout(1000);
    const hover=await page.locator('.memory-album-3d-canvas').screenshot();
    const beforePixels=PNG.sync.read(idle),afterPixels=PNG.sync.read(hover);let changed=0;
    for(let i=0;i<beforePixels.data.length;i+=4){if(Math.max(...[0,1,2].map(c=>Math.abs(beforePixels.data[i+c]-afterPixels.data[i+c])))>12)changed++;}
    assert.ok(changed/(beforePixels.width*beforePixels.height)<.001,'未按住页边时书页应保持静止，不能预先抬起旧页；明显变化像素：'+changed);
    await page.mouse.wheel(0,120);
    await page.waitForFunction(()=>document.querySelector('#memoryAlbumCounter').textContent==='02 / 03'&&!document.querySelector('#memoryAlbumNext').disabled);
    await page.mouse.wheel(0,-120);
    await page.waitForFunction(()=>document.querySelector('#memoryAlbumCounter').textContent==='01 / 03'&&!document.querySelector('#memoryAlbumNext').disabled);
    await page.mouse.click(cx+pw*.5,cy);
    assert.equal(await page.evaluate(()=>viewed),0,'点击照片仍打开原图');
    await page.mouse.move(cx+pw*.5,cy);await page.mouse.down();await page.mouse.move(cx+pw*.6,cy,{steps:4});await page.mouse.up();
    assert.ok(await page.evaluate(()=>memoryShelfState.photoPositions.get(0)?.x<50),'构图操作仍写入现有位置数据');
    const y=cy-ph*.46;
    await page.mouse.move(cx+pw*.95,y);await page.mouse.down();await page.mouse.move(cx+pw*.4,y,{steps:6});
    await page.screenshot({path:path.join(os.tmpdir(),'travel-imported-reader.png')});
    await page.mouse.up();
    await page.waitForFunction(()=>document.querySelector('#memoryAlbumCounter').textContent==='02 / 03'&&!document.querySelector('#memoryAlbumNext').disabled);
    await page.locator('#memoryAlbumPrev').click();await page.waitForFunction(()=>document.querySelector('#memoryAlbumCounter').textContent==='01 / 03'&&!document.querySelector('#memoryAlbumNext').disabled);
    const cdp=await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx+pw*.95,y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx+pw*.55,y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await page.waitForTimeout(1000);
    assert.equal(await page.locator('#memoryAlbumCounter').innerText(),'01 / 03');
    const diagnostics=await page.evaluate(()=>memoryAlbum3DState.reader.getTurnDiagnostics());
    assert.ok(diagnostics.trace.some(entry=>entry.type==='next-command'));
    assert.ok(diagnostics.trace.some(entry=>entry.type==='frame'&&entry.angles.length));
    assert.equal(JSON.stringify(diagnostics).includes('data:image'),false,'诊断文件不包含照片');
    let direction=0,lastProgress=0;
    for(const entry of diagnostics.trace){
      if(entry.pointer?.dragging){direction=0;continue;}
      if((entry.type==='next-command'||entry.type==='previous-command')&&!entry.blocked){direction=entry.type==='next-command'?1:-1;lastProgress=entry.progress;}
      else if(entry.type==='frame'&&direction){
        assert.ok(direction*(entry.progress-lastProgress)>=-1e-7,'Edge 中按钮/滚轮的动画进度不得先反向：'+JSON.stringify({direction,lastProgress,entry}));
        lastProgress=entry.progress;
      }
    }
    // 合到暖纸封底、再合回照片封面；纸页平坦性另由 settled-pages 回归验证。
    for(const target of ['封底','封面']){
      const direction=target==='封底'?1:-1;
      for(let turn=0;turn<4;turn++){
        if(await page.locator('#memoryAlbumCounter').innerText()===target)break;
        await page.evaluate(direction=>memoryTurnAlbum(direction),direction);
        await page.waitForFunction(()=>!document.querySelector('#memoryAlbumPrev').disabled||!document.querySelector('#memoryAlbumNext').disabled);
      }
      assert.equal(await page.locator('#memoryAlbumCounter').innerText(),target);
      const image=PNG.sync.read(await page.locator('.memory-album-3d-canvas').screenshot());
      let paper=0,samples=0;
      for(let y=Math.round(image.height*.15);y<image.height*.85;y++)for(let x=Math.round(image.width*.42);x<image.width*.58;x++){
        const i=(y*image.width+x)*4,r=image.data[i],g=image.data[i+1],b=image.data[i+2];
        if(r>210&&g>200&&b>180&&r>b+8)paper++;
        samples++;
      }
      if(target==='封底')assert.ok(paper/samples>.2,'封底应显示新设计的暖米白纸张');
      else assert.ok(paper/samples<.05,'封面不能露出大块米白内页');
    }
    await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
    const mobileStage=await page.locator('#memoryAlbumStage').boundingBox(),mobileNext=await page.locator('#memoryAlbumNext').boundingBox();
    assert.ok(mobileNext.y>=mobileStage.y+mobileStage.height,'手机翻页按钮在舞台下方，不覆盖照片');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=390),'手机无横向溢出');
    await page.evaluate(()=>memoryDisposeAlbum3D());
    assert.equal(await page.locator('.memory-album-3d-canvas').count(),0,'退出释放阅读器');assert.deepEqual(errors,[]);
  }finally{await browser.close();fs.rmSync(folder,{recursive:true,force:true});}
});
