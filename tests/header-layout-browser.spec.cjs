const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

test('功能菜单位于按钮组最左侧，家乡及账号等快捷功能独立显示，手机和电脑无横向滚动',async()=>{
  const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const styles=[...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
  const start=source.indexOf('  <header>'),end=source.indexOf('</header>',start)+9;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage();
    await page.setContent('<style>'+styles+'</style>'+source.slice(start,end)+'<main style="height:700px"></main>');
    assert.equal(await page.locator('header .stat').filter({hasText:'总计行程'}).count(),0);
    assert.equal(await page.locator('#headerMenuToggle').count(),1,'应有功能菜单入口');
    const scriptStart=source.indexOf('  /* ===== 顶部功能菜单 ===== */'),scriptEnd=source.indexOf('  // 霓虹旋转兜底',scriptStart);
    await page.evaluate(source.slice(scriptStart,scriptEnd));
    const toggle=page.locator('#headerMenuToggle'),panel=page.locator('#headerMenuPanel');
    const shortcuts=['panelsToggle','hometownBtn','feedbackBtn','themeToggleBtn','profileBtn','accountBtn'];
    const menuIds=['cityMemoryBtn','memoryShelfBtn','photoStreamBtn','lifeJourneyBtn','journeyStatsBtn','footprintBtn'];
    for(const width of [1920,1366,390]){
      await page.setViewportSize({width,height:900});
      const brand=await page.locator('.brand').boundingBox(),actions=await page.locator('.header-actions').boundingBox();
      const menuButton=await toggle.boundingBox(),firstShortcut=await page.locator('#panelsToggle').boundingBox();
      assert.ok(menuButton.x+menuButton.width<=firstShortcut.x+1,'功能菜单应在快捷按钮组左侧');
      if(width>720) assert.ok(brand.x+brand.width<=menuButton.x,'标题应保持在功能菜单左侧');
      if(width>720){
        const stats=await page.locator('.header-actions .stats').boundingBox(),gap=menuButton.x-stats.x-stats.width;
        assert.ok(gap>=4 && gap<=10,`统计框应紧邻功能菜单，实际间距${gap}px`);
      }
      if(width>720) assert.ok(Math.abs(brand.y+brand.height/2-actions.y-actions.height/2)<2,'电脑端标题与按钮应在同一行');
      assert.ok(actions.x+actions.width<=width+1,'按钮栏不得撑出屏幕');
      assert.ok(await page.locator('.header-actions').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'顶部不应出现滚动条');
      assert.equal(await panel.isVisible(),false);
      for(const id of shortcuts){
        const button=page.locator('#'+id);assert.equal(await button.isVisible(),true);
        assert.equal(await button.evaluate(e=>!!e.closest('#headerMenuPanel')),false);
        const box=await button.boundingBox();assert.ok(box.x>=actions.x-1 && box.x+box.width<=width+1,'独立按钮必须完整显示，不能被裁切');
        await button.click();
      }
      const account=await page.locator('#accountBtn').boundingBox();
      for(const id of shortcuts.slice(0,-1)){const box=await page.locator('#'+id).boundingBox();if(Math.abs(box.y-account.y)<2)assert.ok(box.x+box.width<=account.x+1,'账号状态应在同行快捷按钮最右侧');}
      for(const id of menuIds) assert.equal(await page.locator('#'+id).isVisible(),false);
      await toggle.click();assert.equal(await panel.isVisible(),true);assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      const box=await panel.boundingBox();assert.ok(box.x>=0 && box.x+box.width<=width && box.y+box.height<=900);
      for(const id of menuIds) assert.equal(await page.locator('#'+id).isVisible(),true);
      assert.equal(await page.locator('#headerMenuPanel .fp-btn-label').first().isVisible(),true,'菜单显示功能名称而非仅图标');
      await page.locator('#cityMemoryBtn').click();assert.equal(await panel.isVisible(),false);
      await toggle.click();await toggle.click();assert.equal(await panel.isVisible(),false);
      await toggle.click();await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);
      assert.equal(await toggle.evaluate(e=>document.activeElement===e),true);
      await toggle.click();await page.locator('main').click({position:{x:10,y:500}});assert.equal(await panel.isVisible(),false);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'页面不得出现横向溢出');
    }
  }finally{await browser.close();}
});
