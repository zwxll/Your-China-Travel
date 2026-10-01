const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((request,response)=>{
  const file=path.resolve(root,'.'+new URL(request.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){response.writeHead(403);return response.end();}
  fs.readFile(file,(error,data)=>{if(error){response.writeHead(404);return response.end();}response.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html');response.end(data);});
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const base='http://127.0.0.1:'+server.address().port;
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const failures=[];page.on('pageerror',error=>failures.push(error.message));
    let published,publications=0;const uploads=new Map(),shares=new Map();
    const {validateJpeg}=await import(require('node:url').pathToFileURL(path.join(root,'supabase/functions/memory-shelf-share/storage-validation.mjs')));
    await page.route('**/functions/v1/memory-shelf-share',async route=>{
      const data=route.request().postDataJSON();
      if(data.action==='quota')return route.fulfill({json:{browserUsed:0,browserReserved:0,browserLimit:50000000,globalUsed:0,globalReserved:0,globalLimit:800000000}});
      if(data.action==='claim')return route.fulfill({json:{claimed:false}});
      if(data.action==='begin'){published={...data,snapshot:data.manifest};return route.fulfill({json:{shareId:data.shareId,uploadedIds:[]}});}
      if(data.action==='upload'){await validateJpeg(data.dataUrl);uploads.set(data.shareId+'/'+data.fileId,data.dataUrl);return route.fulfill({json:{fileId:data.fileId}});}
      if(data.action==='finish'){
        const snapshot={...published.snapshot,storagePrefix:published.shareId};shares.set(published.targetId,snapshot);published.shareId=published.targetId;publications++;return route.fulfill({json:{shareId:published.shareId}});
      }
      const snapshot=shares.get(data.shareId);
      if(data.action==='read-city'){const c=snapshot.provinces[data.provinceIndex].cities[data.cityIndex];return route.fulfill({json:{chapter:{...c,photos:c.photos.map(p=>({name:p.name,dataUrl:uploads.get(snapshot.storagePrefix+'/'+p.fileId)}))}}});}
      return route.fulfill({json:{snapshot:{version:2,provinces:snapshot.provinces.map(p=>({...p,cover:uploads.get(snapshot.storagePrefix+'/'+(p.coverId||p.cities[0].photos[0].fileId)),cities:p.cities.map(c=>({...c,photoCount:c.photos.length,photos:undefined}))}))}}});
    });
    await page.goto(base+'/memory-share.html');
    assert.match(await page.locator('main').innerText(),/分享链接无效/);
    await page.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=24;canvas.getContext('2d').fillRect(0,0,24,24);const dataUrl=canvas.toDataURL('image/jpeg');
      await MemoryShelfShare.create([{name:'湖北省',review:'旅行笔记',cover:dataUrl,cities:[{name:'孝感市',cityKey:'test',firstMonth:'2026-08',meta:{description:'测试城市'}}]}],async()=>[{dataUrl,name:'照片1'},{dataUrl,name:'照片2'},{kind:'video',dataUrl:'data:video/mp4;base64,AAAA'}],()=>{});
    });
    assert.equal(published.snapshot.provinces[0].cities[0].photos.length,2,'不上传视频');
    assert.equal(published.managementKey.length,64);
    await page.getByRole('button',{name:'保存海报',exact:true}).waitFor();
    assert.equal(await page.getByRole('button',{name:'保存海报',exact:true}).isEnabled(),true);
    await page.waitForFunction(()=>document.querySelector('.memory-share-dialog img')?.naturalWidth===1080);
    const size=await page.getByAltText('记忆书架分享海报').evaluate(img=>({width:img.naturalWidth,height:img.naturalHeight}));
    assert.deepEqual(size,{width:1080,height:1440});
    const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'保存海报',exact:true}).click()]);
    assert.equal(download.suggestedFilename(),'旅行记忆书架.png');
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-share-poster.png')});
    const firstId=published.shareId;
    await page.locator('.memory-share-dialog').getByRole('button',{name:'关闭',exact:true}).click();
    await page.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=24;const dataUrl=canvas.toDataURL('image/jpeg');
      await MemoryShelfShare.create([{name:'浙江省',cities:[{name:'杭州市'}]}],async()=>[{dataUrl}],()=>{});
    });
    assert.notEqual(published.shareId,firstId,'不同省份使用独立二维码');
    assert.equal(published.snapshot.provinces.length,1);
    assert.equal(published.snapshot.provinces[0].name,'浙江省');
    await page.locator('.memory-share-dialog').getByRole('button',{name:'关闭',exact:true}).click();
    await page.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=24;const dataUrl=canvas.toDataURL('image/jpeg');
      await MemoryShelfShare.create([{name:'湖北省',cities:[{name:'孝感市',cityKey:'test',meta:{}}]}],async()=>[{dataUrl,name:'新照片'}],()=>{});
    });
    assert.equal(publications,3);assert.equal(published.shareId,firstId,'分享其他省份后再次生成仍沿用本省二维码');
    await page.goto(base+'/memory-share.html?s='+firstId);
    await page.getByRole('button',{name:/湖北省/}).click();
    await page.getByRole('button',{name:'下一页',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#page-status').textContent.startsWith('3 /')&&document.querySelector('#book').getAttribute('aria-busy')==='false');
    await page.getByRole('button',{name:'查看第 1 张照片'}).click();
    assert.equal(await page.locator('#count').innerText(),'1 / 1');
    assert.equal(await page.getByRole('button',{name:'上一张',exact:true}).isDisabled(),true);
    assert.equal(await page.getByRole('button',{name:'下一张',exact:true}).isDisabled(),true);
    assert.equal(await page.locator('button').filter({hasText:/编辑|上传|登录|删除/}).count(),0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'手机无横向溢出');
    assert.deepEqual(failures,[]);
    await page.goto(base+'/memory-share.html');
    await page.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=600;
      const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(600,600);let seed=123456;
      for(let i=0;i<pixels.data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;pixels.data[i]=i%4===3?255:seed>>>24;}
      ctx.putImageData(pixels,0,0);const dataUrl=canvas.toDataURL('image/jpeg',.7);
      await MemoryShelfShare.create(['测试甲省','测试乙省'].map(name=>({name,cover:dataUrl,cities:[{name:name+'城市'}]})),async()=>Array.from({length:40},(_,i)=>{
        for(let j=0;j<pixels.data.length;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;pixels.data[j]=j%4===3?255:seed>>>24;}
        ctx.putImageData(pixels,0,0);return {name:'独立测试图'+i,dataUrl:canvas.toDataURL('image/jpeg',.7)};
      }),()=>{});
    });
    assert.equal(published.snapshot.provinces.length,2);assert.equal(published.snapshot.files.length,81,'80 张独立照片与共用的一个封面');
    const total=published.snapshot.files.reduce((n,f)=>n+f.bytes,0);assert.ok(total>12*1024*1024,'总量超过旧 12MiB 限制仍能生成一个海报');assert.ok(total<50000000);
    assert.ok(published.snapshot.files.every(f=>f.bytes<=307200));
    const selectedId=published.shareId;await page.goto(base+'/memory-share.html?s='+selectedId);
    await page.locator('#shelf .book').first().waitFor();
    assert.equal(await page.locator('#shelf .book').count(),2,'同一个二维码仅显示选择的两省');
    for(const provinceName of ['测试甲省','测试乙省']){
      await page.getByRole('button',{name:new RegExp(provinceName)}).click();await page.locator('#book').waitFor();
      assert.equal(await page.locator('#book .shared-photo').count(),40);await page.getByRole('button',{name:'返回书架'}).click();
    }
    const main=fs.readFileSync(path.join(root,'index.html'),'utf8');
    const info=main.slice(main.indexOf('  function memoryInfoHtml('),main.indexOf('  function memoryUpdateProvinceInfo('));
    const sharing=main.slice(main.indexOf('  let memoryProvinceSharing='),main.indexOf('  function closeMemoryShelf()'));
    const binding=main.slice(main.indexOf("  if(memoryShelfBodyEl) memoryShelfBodyEl.addEventListener('click'"),main.indexOf("  if($('memoryProvinceEditorClose'))"));
    const styles=[...main.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match=>match[1]).join('\n')+fs.readFileSync(path.join(root,'assets/memory-share.css'),'utf8');
    await page.setContent('<style>'+styles+'</style><p id="memoryShelfIntro"></p><div id="memoryShelfBody" style="width:320px"></div>');
    const ui=await page.evaluate(({info,sharing,binding})=>{
      const province={name:'新疆维吾尔自治区',cities:[{name:'吐鲁番市',cityKey:'xinjiang'}],photoCount:1};
      window.$=id=>document.getElementById(id);window.escapeHtml=text=>String(text).replace(/[&<>"']/g,'');window.memoryProvinceDateText=()=>'';
      window.memoryShelfState={provinces:[{name:'湖北省'},province],active:1};window.memoryShelfBodyEl=$('memoryShelfBody');window.confirm=()=>true;window.toast=()=>{};
      window.getPhotosByCity=()=>[];window.openMemoryProvinceEditor=()=>{};
      window.MemoryShelfShare={create:async books=>{window.sharedNames=books.map(book=>book.name);}};
      window.eval(info+sharing+binding+"\nmemoryShelfBodyEl.innerHTML=memoryInfoHtml(memoryShelfState.provinces[1],1,2);");
      const title=document.querySelector('.memory-info-name').getBoundingClientRect(),button=document.querySelector('[data-memory-province-share]').getBoundingClientRect();
      return {overlap:button.top<title.bottom,overflow:document.documentElement.scrollWidth>innerWidth};
    },{info,sharing,binding});
    assert.equal(ui.overlap,false,'分享按钮在省份标题下方，不重叠');assert.equal(ui.overflow,false);
    await page.getByRole('button',{name:'分享新疆维吾尔自治区书架'}).click();
    assert.deepEqual(await page.evaluate(()=>sharedNames),['新疆维吾尔自治区'],'省份按钮只分享对应省份');
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-province-share.png')});
    console.log('PASS: 单省独立更新、多省超过12MiB分文件分享、一个二维码浏览两省、视频排除、海报下载、只读浏览与按钮布局');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
