const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('管理分享：免登录空状态、确认取消、撤销缓存、清理失败重试及本地资料保留',async()=>{
  const root=path.resolve('.'),server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(e,data)=>{res.statusCode=e?404:200;res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(e?'':data);});});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:375,height:812}}),requests=[],id='12345678-1234-4234-8234-123456789abc';let revoked=false,cleaned=false,failClaim=false;
    const quota=()=>({browserUsed:cleaned?0:100,browserReserved:0,browserLimit:50000000});
    await page.route('**/functions/v1/memory-shelf-share',route=>{
      const body=route.request().postDataJSON();requests.push(body);
      if(body.action==='claim'){if(failClaim){failClaim=false;return route.fulfill({status:503,json:{error:'claim unavailable'}});}return route.fulfill({json:{claimed:true,version:3}});}
      if(body.action==='list')return route.fulfill({json:{quota:quota(),cleanupPending:revoked&&!cleaned,shares:revoked?[]:[{shareId:id,provinces:['浙江省'],photoCount:2,kind:'published',updatedAt:'2026-10-01'}]}});
      if(body.action==='revoke'||body.action==='clear'){revoked=true;return route.fulfill({json:{revokedIds:[id],cleanupPending:true,freedBytes:0,quota:quota()}});}
      if(body.action==='retry-cleanup'){cleaned=true;return route.fulfill({json:{cleanupPending:false,freedBytes:100,quota:quota()}});}
      return route.fulfill({json:{}});
    });
    await page.goto('http://127.0.0.1:'+server.address().port+'/memory-share.html');
    assert.equal(await page.evaluate(()=>typeof MemoryShelfShare.manage),'function');
    await page.evaluate(()=>MemoryShelfShare.manage());
    const dialog=page.locator('.memory-share-management');await dialog.getByText('此浏览器没有可管理的分享').waitFor();assert.equal(requests.length,0);
    await dialog.getByRole('button',{name:'关闭',exact:true}).click();
    await page.evaluate(id=>{localStorage.setItem('memoryShareBrowserIdentity',JSON.stringify({browserId:id,browserKey:'a'.repeat(64)}));localStorage.setItem('memoryProvinceShareManagement:浙江省',JSON.stringify({shareId:id,managementKey:'b'.repeat(64)}));localStorage.setItem('memorySelectedShareManagement:'+id,JSON.stringify({shareId:id,managementKey:'b'.repeat(64)}));localStorage.setItem('travelPhotos','keep-local-originals');MemoryShelfShare.manage();},id);
    const remove=dialog.getByRole('button',{name:'删除这份分享',exact:true});await remove.waitFor();
    page.once('dialog',d=>d.dismiss());await remove.click();assert.equal(requests.some(r=>r.action==='revoke'),false);
    page.once('dialog',d=>{assert.match(d.message(),/本地照片不受影响/);d.accept();});await remove.click();
    await dialog.getByText(/容量暂时保留/).waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('memoryProvinceShareManagement:浙江省')),null);
    assert.equal(await page.evaluate(()=>localStorage.getItem('travelPhotos')),'keep-local-originals');
    assert.ok(await page.evaluate(()=>localStorage.getItem('memoryShareBrowserIdentity')));
    await dialog.getByRole('button',{name:'重试清理',exact:true}).click();await dialog.getByRole('status').filter({hasText:/清理完成/}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.ok(requests.filter(r=>r.action==='claim').length>=1);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-share-management-mobile.png')});
    await dialog.getByRole('button',{name:'关闭',exact:true}).click();revoked=cleaned=false;failClaim=true;
    await page.evaluate(id=>{localStorage.setItem('memoryProvinceShareManagement:浙江省',JSON.stringify({shareId:id,managementKey:'b'.repeat(64)}));MemoryShelfShare.manage();},id);
    await dialog.getByRole('status').filter({hasText:'claim unavailable'}).waitFor();
    assert.equal(await dialog.getByRole('button',{name:'重新加载',exact:true}).count(),1,'加载失败必须重试认领，而非误报清理成功');
    const claims=requests.filter(r=>r.action==='claim').length;
    await dialog.getByRole('button',{name:'重新加载',exact:true}).click();await dialog.getByRole('button',{name:'删除这份分享',exact:true}).waitFor();
    assert.equal(requests.filter(r=>r.action==='claim').length,claims+1);
    page.once('dialog',d=>d.accept());await dialog.getByRole('button',{name:'清空我的全部分享',exact:true}).click();
    await dialog.getByRole('status').filter({hasText:/容量暂时保留/}).waitFor();assert.equal(requests.filter(r=>r.action==='clear').length,1);
    const main=fs.readFileSync(path.join(root,'index.html'),'utf8'),start=main.indexOf('      <div class="memory-shelf-head">'),end=main.indexOf('      <div id="memoryShelfBody"',start);
    const styles=[...main.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n')+fs.readFileSync(path.join(root,'assets/memory-share.css'),'utf8');
    await page.setContent('<style>'+styles+'</style><div class="memory-shelf-overlay show"><section class="memory-shelf-dialog">'+main.slice(start,end)+'</section></div>');
    for(const width of [375,1280]){
      await page.setViewportSize({width,height:900});
      const boxes=await page.evaluate(()=>['memoryShelfTitle','memoryShelfShare','memoryShelfManage','memoryShelfClose'].map(id=>{const b=document.getElementById(id).getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom};}));
      for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(boxes[i].right<=boxes[j].x||boxes[j].right<=boxes[i].x||boxes[i].bottom<=boxes[j].y||boxes[j].bottom<=boxes[i].y,'标题、分享、管理、关闭按钮不得重叠');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
  }finally{await browser.close();await new Promise(r=>server.close(r));}
});
