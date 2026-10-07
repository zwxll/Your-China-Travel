const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('本地相册封底参考手机分享页：暖纸、终章文字和最后一张完整照片',async()=>{
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const font=html.slice(html.indexOf('  function memoryAlbumSetFont('),html.indexOf('  function memoryAlbumWrapText('));
  const cover=html.slice(html.indexOf('  function memoryAlbumPaintCover('),html.indexOf('  function memoryAlbumPaintContent('));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();await page.setContent('<canvas width="600" height="780"></canvas>');
    await page.addScriptTag({content:font+cover+`
      const image=color=>{const canvas=document.createElement('canvas');canvas.width=200;canvas.height=400;const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,200,400);return canvas};
      const memoryShelfState={city:{name:'金华市'},photos:[{_memoryImage:image('#c14c32')},{_memoryImage:image('#2d7081')}]};
      const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),texts=[];
      const fillText=ctx.fillText.bind(ctx);ctx.fillText=(text,...args)=>{texts.push(text);fillText(text,...args)};
      memoryAlbumPaintCover({canvas,ctx,W:600,H:780,S:1,rects:[]},'back');
      window.backResult={texts,paper:Array.from(ctx.getImageData(560,300,1,1).data),photo:Array.from(ctx.getImageData(300,490,1,1).data)};
    `});
    const result=await page.evaluate(()=>window.backResult);
    assert.deepEqual(result.paper,[244,241,232,255],'封底应是分享页的暖米白纸张，不再深灰');
    assert.deepEqual(result.photo,[45,112,129,255],'封底展示最后一张照片，不使用首图或占位图');
    for(const text of ['旅行记忆','终章','把时光','留在这一册','记录一座城，也记录那时的自己。','金华市','未完待续'])assert.ok(result.texts.includes(text),'缺少封底文字：'+text);
    const empty=await page.evaluate(()=>{memoryShelfState.photos=[];memoryAlbumPaintCover({canvas,ctx,W:600,H:780,S:1,rects:[]},'back');return texts.includes('尚未记录')});
    assert.equal(empty,true,'照片缺失时不虚构图片或文案');
  }finally{await browser.close();}
});
