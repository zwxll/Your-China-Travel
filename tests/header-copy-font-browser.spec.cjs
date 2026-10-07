const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('电脑端左上标题与文案使用完整宋体字形，字号及扫光不变',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},javaScriptEnabled:false});
    await page.route(/^https?:/,r=>r.abort());
    await page.goto(require('node:url').pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    const result=await page.evaluate(async()=>{
      const styles=[],glyphs=[];
      for(const selector of ['.brand h1','.brand .sub']){
        const el=document.querySelector(selector),s=getComputedStyle(el);
        styles.push({family:s.fontFamily,size:s.fontSize,weight:s.fontWeight,animation:s.animationName,spacing:s.letterSpacing});
        for(const ch of new Set(el.textContent)){
          const span=document.createElement('span');span.id='header-glyph-'+glyphs.length;span.textContent=ch;
          span.style.font=s.font;document.body.append(span);glyphs.push({id:span.id,ch});
        }
      }
      await document.fonts.ready;return {styles,glyphs};
    });
    assert.ok(result.styles.every(s=>s.family.startsWith('"Noto Serif SC"')));
    assert.deepEqual(result.styles.map(s=>s.size),['20px','12px']);
    assert.deepEqual(result.styles.map(s=>s.weight),['800','400']);
    assert.deepEqual(result.styles.map(s=>s.spacing),['1.6px','1px']);
    assert.ok(result.styles.every(s=>s.animation==='shinyTextYoyo'));
    const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root}=await cdp.send('DOM.getDocument');
    for(const {id,ch} of result.glyphs){
      const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#'+id});
      const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
      assert.ok(fonts.length&&fonts.every(f=>f.isCustomFont&&f.familyName.startsWith('Noto Serif SC')),ch+'不能回退系统字形');
    }
  }finally{await browser.close();}
});
