const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('选择省份：单选、多选、全选、取消，匿名分文件上传',async()=>{
  const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(e,data)=>{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html');res.statusCode=e?404:200;res.end(e?'':data);});});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}}),requests=[],drafts=new Map(),finished=new Set();let loseFinish=false,denyQuota=false,reuseFull=false;
    await page.route('**/functions/v1/memory-shelf-share',route=>{
      const body=route.request().postDataJSON();requests.push(body);
      if(body.action==='quota')return route.fulfill({json:{browserUsed:denyQuota?50000000:0,browserReserved:0,browserLimit:50000000,globalUsed:0,globalReserved:0,globalLimit:800000000}});
      if(body.action==='begin'){if(denyQuota&&!reuseFull)return route.fulfill({status:400,json:{error:'此匿名浏览器累计分享超过 50MB'}});drafts.set(body.shareId,body);return route.fulfill({json:{shareId:body.shareId,newBytes:reuseFull?0:undefined,uploadedIds:reuseFull||finished.has(body.shareId)?body.manifest.files.map(f=>f.fileId):[]}});}
      if(body.action==='finish'){finished.add(body.shareId);if(loseFinish){loseFinish=false;return route.abort('failed');}return route.fulfill({json:{shareId:drafts.get(body.shareId).targetId}});}
      if(body.action==='cancel'&&finished.has(body.shareId))return route.fulfill({status:400,json:{error:'已发布书架不能取消'}});
      return route.fulfill({json:{shareId:body.targetId||body.shareId,uploadedIds:[]}});
    });
    await page.goto('http://127.0.0.1:'+server.address().port+'/memory-share.html');
    const open=()=>page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=24;const dataUrl=canvas.toDataURL('image/jpeg');window.testBooks=['河南省','浙江省','湖北省','空省'].map((name,i)=>({name,photoCount:i===3?0:1,cover:dataUrl,cities:[{name:name+'城市'}]}));MemoryShelfShare.select(testBooks,async()=>[{dataUrl},{kind:'video',dataUrl:'video'}],()=>{});});
    await open();const dialog=page.locator('.memory-share-selection');
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-share-selection-mobile.png')});
    await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-share-selection-desktop.png')});await page.setViewportSize({width:390,height:844});
    const submit=dialog.getByRole('button',{name:'上传并生成海报',exact:true});assert.equal(await submit.isDisabled(),true);
    assert.equal(await dialog.getByRole('checkbox',{name:/空省/}).isDisabled(),true);
    await dialog.getByRole('checkbox',{name:/河南省/}).check();assert.equal(await submit.isEnabled(),true);
    await dialog.getByRole('checkbox',{name:/浙江省/}).check();
    await dialog.getByRole('button',{name:'全选',exact:true}).click();assert.equal(await dialog.locator('input:checked').count(),3);
    await dialog.getByRole('button',{name:'取消全选',exact:true}).click();assert.equal(await submit.isDisabled(),true);
    await dialog.getByRole('button',{name:'取消',exact:true}).click();assert.equal(requests.length,0);
    await open();await dialog.getByRole('checkbox',{name:/河南省/}).check();await dialog.getByRole('checkbox',{name:/浙江省/}).check();await submit.click();
    await page.getByAltText('记忆书架分享海报').waitFor();
    const begin=requests.find(r=>r.action==='begin');assert.deepEqual(begin.manifest.provinces.map(p=>p.name),['河南省','浙江省']);assert.equal(begin.manifest.provinces[0].cities[0].photos.length,1);
    assert.equal(requests.filter(r=>r.action==='upload').length,1,'相同照片和封面只传一次，视频排除');
    assert.equal(begin.browserKey.length,64);assert.equal(begin.managementKey.length,64);
    const url=await page.getByRole('link',{name:'打开只读书架'}).getAttribute('href');assert.equal(new URL(url).searchParams.size,1);assert.ok(!url.includes(begin.browserKey));
    assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('memorySelectedShareManagement:'+id)).managementKey,begin.targetId),begin.managementKey,'生成后独立管理密钥留在本浏览器，不随草稿删除');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-selected-share-mobile.png')});
    await page.locator('.memory-share-dialog').getByRole('button',{name:'关闭',exact:true}).click();
    await open();await dialog.getByRole('checkbox',{name:/湖北省/}).check();await submit.click();await page.getByAltText('记忆书架分享海报').waitFor();
    const begins=requests.filter(r=>r.action==='begin');assert.equal(begins[0].browserId,begins[1].browserId,'所有分享使用同一匿名身份');assert.notEqual(begins[0].targetId,begins[1].targetId);
    assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(key=>key.startsWith('memoryProvinceShareManagement:')).length),0,'顶部单选不创建旧省份分享凭证');
    await page.locator('.memory-share-dialog').getByRole('button',{name:'关闭',exact:true}).click();
    const create=()=>page.evaluate(async()=>{
      try{await MemoryShelfShare.create(testBooks.slice(0,2),async()=>[{dataUrl:testBooks[0].cover}],()=>{});return '';}
      catch(error){return error.message;}
    });
    loseFinish=true;assert.match(await create(),/草稿容量暂时保留/);
    const lost=requests.filter(r=>r.action==='begin').at(-1),uploadsBefore=requests.filter(r=>r.action==='upload').length;
    assert.equal(await create(),'');await page.getByAltText('记忆书架分享海报').waitFor();
    assert.equal(requests.filter(r=>r.action==='begin').at(-1).shareId,lost.shareId,'响应丢失后沿用同一上传会话');
    assert.equal(requests.filter(r=>r.action==='upload').length,uploadsBefore,'已发布会话恢复链接不重传、不重复占用');
    assert.equal(new URL(await page.getByRole('link',{name:'打开只读书架'}).getAttribute('href')).searchParams.get('s'),lost.targetId);
    await page.locator('.memory-share-dialog').getByRole('button',{name:'关闭',exact:true}).click();
    denyQuota=true;const before=requests.filter(r=>r.action==='upload').length;assert.match(await create(),/50MB/);assert.equal(requests.filter(r=>r.action==='upload').length,before,'新增容量由服务端拒绝，不发文件上传');
    reuseFull=true;assert.equal(await create(),'');assert.equal(requests.filter(r=>r.action==='upload').length,before,'满额但全部复用允许生成新链接，无新文件上传');
    await page.locator('.memory-share-dialog').getByRole('button',{name:'关闭',exact:true}).click();
    reuseFull=false;await open();await dialog.getByRole('checkbox',{name:/湖北省/}).check();await submit.click();
    await page.waitForFunction(()=>document.querySelector('.memory-share-selection [role="status"]').textContent.includes('50MB'));
    assert.equal(await submit.isEnabled(),true,'统一入口失败后恢复按钮，允许重试');
    await dialog.getByRole('button',{name:'取消',exact:true}).click();
    denyQuota=false;await open();await dialog.getByRole('button',{name:'全选',exact:true}).click();await submit.click();await page.getByAltText('记忆书架分享海报').waitFor();
    assert.deepEqual(requests.filter(r=>r.action==='begin').at(-1).manifest.provinces.map(p=>p.name),['河南省','浙江省','湖北省'],'全选实际分享所有有照片的省份');
  }finally{await browser.close();await new Promise(r=>server.close(r));}
});
