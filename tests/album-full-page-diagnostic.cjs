// Read-only full-page diagnosis: synthetic photos in an isolated Edge profile.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace('  async function openMemoryShelf(){',`  window.__albumDiagnostic={
  async open(){
    const dataUrl='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#819eaa"/></svg>');
    getPhotosByCity=async()=>Array.from({length:25},()=>({dataUrl}));
    memoryShelfOverlayEl.classList.add('show');document.body.classList.add('modal-open');
    await memoryOpenAlbum({name:'浙江省'}, {name:'金华市',cityKey:'diagnostic',meta:{}});
  },state:()=>({page:memoryShelfState.page,counter:$('memoryAlbumCounter')?.textContent,disabled:$('memoryAlbumNext')?.disabled})};
  async function openMemoryShelf(){`);
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
  if(req.url==='/'||file===path.join(root,'index.html'))res.end(html);
  else if(fs.existsSync(file)&&fs.statSync(file).isFile())res.end(fs.readFileSync(file));
  else res.writeHead(404).end();
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1604,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
    await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__albumDiagnostic,{timeout:15000});
    await page.evaluate(()=>window.__albumDiagnostic.open());
    await page.evaluate(()=>{document.querySelector('#authOverlay')?.classList.remove('show');document.querySelector('#launch-screen')?.remove();});
    console.log('opened',await page.evaluate(()=>window.__albumDiagnostic.state()));
    for(const direction of [1,-1]){
      const before=await page.evaluate(()=>window.__albumDiagnostic.state());
      const button=page.locator(direction>0?'#memoryAlbumNext':'#memoryAlbumPrev');
      if(await button.isDisabled())continue;
      await button.click();
      await page.waitForFunction(()=>!document.querySelector('#memoryAlbumPrev').disabled||!document.querySelector('#memoryAlbumNext').disabled);
      const after=await page.evaluate(()=>window.__albumDiagnostic.state());
      console.log(JSON.stringify({direction,before:before.counter,after:after.counter}));
    }
    const downloaded=page.waitForEvent('download');
    await page.keyboard.press('Alt+Shift+D');
    const file=await downloaded;
    const diagnostics=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
    if(!diagnostics.trace.some(row=>row.type==='next-command'))throw new Error('诊断文件缺少按钮命令');
    if(JSON.stringify(diagnostics).includes('data:image'))throw new Error('诊断文件包含照片');
    console.log('diagnostics shortcut verified',file.suggestedFilename(),diagnostics.trace.length);
    console.log('page errors',errors);
    await page.screenshot({path:path.join(require('os').tmpdir(),'album-full-page-edge.png')});
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e.message);server.close();process.exitCode=1;});
