const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('v2 目录按城市加载、切城忽略过时结果、失败可重试',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}}),requests=[],pending=[];
    const photo={name:'测试图',dataUrl:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#719688"/></svg>')};
    let failing=false;
    await page.route('**/functions/v1/memory-shelf-share',route=>{
      const input=route.request().postDataJSON();requests.push(input);
      if(input.action==='read')return route.fulfill({json:{snapshot:{version:2,provinces:[{name:'河南省',cover:photo.dataUrl,cities:[{name:'郑州市',photoCount:5},{name:'洛阳市',photoCount:2}]},{name:'浙江省',cover:photo.dataUrl,cities:[{name:'杭州市',photoCount:1}]}]}}});
      if(input.cityIndex===0&&input.provinceIndex===0){pending.push(route);return;}
      return route.fulfill(failing?{status:503,json:{error:'照片暂时无法读取'}}:{json:{chapter:{name:input.provinceIndex===1?'杭州市':'洛阳市',photos:[photo]}}});
    });
    await page.goto(pathToFileURL(path.resolve('memory-share.html')).href+'?s=00000000-0000-4000-8000-000000000001');
    await page.getByRole('button',{name:/河南省/}).waitFor();assert.equal(requests.length,1);assert.match(await page.locator('#shelf').innerText(),/7 张照片/);
    await page.getByRole('button',{name:/河南省/}).click();await page.getByRole('button',{name:'洛阳市',exact:true}).click();await page.locator('#book').waitFor();
    assert.match(await page.locator('#book').innerText(),/洛阳市/);assert.equal(requests.at(-1).cityIndex,1);
    await pending[0].fulfill({json:{chapter:{name:'郑州市',photos:Array(5).fill(photo)}}});
    await page.waitForTimeout(100);assert.match(await page.locator('#book').innerText(),/洛阳市/);assert.doesNotMatch(await page.locator('#book').innerText(),/郑州市/);
    await page.getByRole('button',{name:'返回书架'}).click();failing=true;await page.getByRole('button',{name:/浙江省/}).click();
    await page.getByRole('button',{name:'重试读取'}).waitFor();assert.equal(await page.locator('#book').count(),0);
    failing=false;await page.getByRole('button',{name:'重试读取'}).click();await page.locator('#book').waitFor();assert.match(await page.locator('#book').innerText(),/杭州市/);
    assert.equal(requests.at(-1).provinceIndex,1);assert.equal(await page.locator('button').filter({hasText:/编辑|上传|登录|删除/}).count(),0);
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-storage-reader-mobile.png')});
    await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(require('node:os').tmpdir(),'memory-storage-reader-desktop.png')});
  }finally{await browser.close();}
});
