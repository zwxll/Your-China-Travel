const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

test('管理分享查看原链接海报，可保存且不上传，草稿不提供海报，读取失败可重试',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:375,height:812},acceptDownloads:true}),requests=[],errors=[];
    const id='12345678-1234-4234-8234-123456789abc',draft='12345678-1234-4234-8234-123456789abd';
    const photo='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="60" height="80"><rect width="60" height="80" fill="#719688"/></svg>');
    let fail=false,version=2;
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/functions/v1/memory-shelf-share',route=>{
      const body=route.request().postDataJSON();requests.push(body);
      if(body.action==='list')return route.fulfill({json:{quota:{browserUsed:100,browserReserved:0,browserLimit:50000000},shares:[
        {shareId:id,provinces:['浙江省'],photoCount:2,kind:'published',updatedAt:'2026-10-01'},
        {shareId:draft,provinces:['湖南省'],photoCount:1,kind:'draft',updatedAt:'2026-10-01'}]}});
      if(body.action==='read')return fail?route.fulfill({status:404,json:{error:'分享已失效'}}):route.fulfill({json:{snapshot:{version,provinces:[{name:'浙江省',cover:photo,cities:[{name:'杭州市',...(version===2?{photoCount:2}:{photos:[{dataUrl:photo},{dataUrl:photo}]})}]}]}}});
      return route.fulfill({status:400,json:{error:'不应调用写入接口'}});
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../memory-share.html')).href);
    await page.evaluate(id=>{localStorage.setItem('memoryShareBrowserIdentity',JSON.stringify({browserId:id,browserKey:'a'.repeat(64)}));MemoryShelfShare.manage();},id);
    const management=page.locator('.memory-share-management');await management.getByText(/已发布/).waitFor();
    const view=management.getByRole('button',{name:'查看海报',exact:true});
    assert.equal(await view.count(),1,'只有已发布记录提供海报');
    for(version of [2,1]){
      await view.click();
      const preview=page.locator('.memory-share-dialog').filter({has:page.getByRole('heading',{name:'浙江省分享海报',exact:true})});
      await preview.getByRole('button',{name:'保存海报',exact:true}).waitFor();
      await page.waitForFunction(()=>[...document.querySelectorAll('.memory-share-dialog button')].some(b=>b.textContent==='保存海报'&&!b.disabled));
      assert.equal(await preview.getByRole('link',{name:'打开只读书架'}).getAttribute('href'),'https://zwxll.github.io/Your-China-Travel/memory-share.html?s='+id);
      const image=preview.getByRole('img',{name:'记忆书架分享海报'});
      assert.ok((await image.getAttribute('src')).startsWith('data:image/png'));
      assert.ok(await image.evaluate(img=>img.naturalWidth===1080&&img.naturalHeight===1440));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      const downloaded=page.waitForEvent('download');await preview.getByRole('button',{name:'保存海报',exact:true}).click();
      assert.equal((await downloaded).suggestedFilename(),'旅行记忆书架.png');
      if(version===2)await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-share-managed-poster.png')});
      await preview.getByRole('button',{name:'关闭',exact:true}).click();
      assert.equal(await management.isVisible(),true,'关闭海报仍能管理原分享');
    }
    fail=true;await view.click();
    const preview=page.locator('.memory-share-dialog').filter({has:page.getByRole('heading',{name:'浙江省分享海报',exact:true})});
    await preview.getByText('分享已失效',{exact:true}).waitFor();
    assert.equal(await preview.getByRole('button',{name:'保存海报'}).isDisabled(),true);
    await preview.getByRole('button',{name:'关闭',exact:true}).click();fail=false;
    assert.equal(await view.isEnabled(),true,'失败后可以再次查看');
    assert.deepEqual(requests.map(r=>r.action),['list','read','read','read']);
    assert.ok(requests.filter(r=>r.action==='read').every(r=>r.shareId===id&&!r.browserKey&&!r.managementKey));
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
