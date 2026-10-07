const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

test('电脑启动页两句文案及烟雾字符使用宋体，字号和呈现样式不变',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},javaScriptEnabled:false});
    await page.route(/^https?:/,route=>route.abort());
    await page.goto(require('node:url').pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    const styles=await page.evaluate(()=>{
      const subtitle=document.querySelector('.launch-subtitle'),motto=document.querySelector('.launch-motto');
      const char=document.createElement('span');char.className='smt-char';char.textContent='记';subtitle.append(char);
      return [subtitle,char,motto].map(el=>{const s=getComputedStyle(el);return {family:s.fontFamily,size:s.fontSize,weight:s.fontWeight,spacing:s.letterSpacing,position:s.position,bottom:s.bottom,opacity:s.opacity,background:s.backgroundImage,fill:s.webkitTextFillColor};});
    });
    assert.ok(styles.every(s=>s.family.startsWith('"Noto Serif SC Launch"')),'普通文案和动画拆字均需继承完整文案宋体');
    assert.deepEqual(styles.map(s=>s.size),['25.6px','25.6px','22.4px']);
    assert.deepEqual(styles.map(s=>s.weight),['400','400','600']);
    assert.equal(styles[1].opacity,'0','烟雾字符原有初始显隐保留');
    assert.equal(styles[0].fill,'rgb(186, 230, 253)');
    assert.equal(styles[2].position,'absolute');assert.equal(styles[2].bottom,'60px');
    assert.ok(styles[2].background.startsWith('linear-gradient'),'标语渐变保留');
    assert.equal(styles[2].spacing,'4.928px');
    // 检查实际渲染字体，而不仅是 CSS 声明，防止子集缺字回退到系统字体。
    const glyphs=await page.evaluate(async()=>{
      const rows=[];
      for(const selector of ['.launch-subtitle','.launch-motto']){
        const el=document.querySelector(selector),s=getComputedStyle(el);
        const text=selector==='.launch-subtitle'?'记录一座城，也记录那时的自己':'把旅行写成诗，把远方纳入方寸';
        for(const char of new Set(text)){
          const span=document.createElement('span');span.id='font-probe-'+rows.length;span.textContent=char;
          span.style.font=s.font;document.body.append(span);rows.push({id:span.id,char});
        }
      }
      await document.fonts.ready;return rows;
    });
    const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root}=await cdp.send('DOM.getDocument');
    for(const {id,char} of glyphs){
      const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#'+id});
      const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
      assert.ok(fonts.length&&fonts.every(f=>f.isCustomFont&&f.familyName.startsWith('Noto Serif SC')),char+'必须使用思源宋体字形，不能回退系统字体');
    }
  }finally{await browser.close();}
});
