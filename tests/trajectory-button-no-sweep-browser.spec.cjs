const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

test('电脑端旅行轨迹两个按钮无循环扫光，静态样式及交互状态保留',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},javaScriptEnabled:false});
    await page.route(/^https?:/,r=>r.abort());
    await page.goto(require('node:url').pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root}=await cdp.send('DOM.getDocument');
    for(const id of ['tlBtnPlay','tlBtnOverview']){
      const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#'+id});
      for(const state of [[],['hover'],['active']]){
        await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:state});
        const style=await page.evaluate(id=>{
          const el=document.getElementById(id),s=getComputedStyle(el),a=getComputedStyle(el,'::after');
          return {animation:a.animationName,content:a.content,color:s.color,size:s.fontSize,border:s.borderTopWidth,shadow:s.boxShadow};
        },id);
        assert.equal(style.animation,'none','按钮不能再运行扫光动画');
        assert.equal(style.content,'none','不渲染高光扫描层');
        assert.equal(style.color,'rgb(56, 189, 248)');assert.equal(style.size,'13px');
        assert.equal(style.border,'1px');assert.notEqual(style.shadow,'none');
      }
    }
  }finally{await browser.close();}
});
