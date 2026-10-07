const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

test('电脑端功能菜单：旅行书架与光影相册名称及无障碍标签一致',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},javaScriptEnabled:false});
    await page.route('**/*',route=>route.abort());
    await page.setContent(fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8'),{waitUntil:'domcontentloaded'});
    for(const [id,name] of [['memoryShelfBtn','旅行书架'],['photoStreamBtn','光影相册']]){
      const button=page.locator('#'+id);
      assert.equal(await button.locator('.fp-btn-label').textContent(),name);
      assert.equal(await button.getAttribute('aria-label'),name);
    }
    assert.equal(await page.locator('#memoryShelfTitle').textContent(),'旅行书架');
  }finally{await browser.close();}
});
