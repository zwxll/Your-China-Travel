const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
test('伞幕选中照片隐藏前方重叠照片，切换和退出恢复，位置尺寸不变',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    const folder=fs.mkdtempSync(path.join(os.tmpdir(),'canopy-occlusion-'));
    fs.writeFileSync(path.join(folder,'index.html'),'<div id="host"></div>');
    await page.goto(require('node:url').pathToFileURL(path.join(folder,'index.html')).href);
    await page.addScriptTag({path:path.join(root,'assets/umbrella-canopy/embedded.js')});
    await page.evaluate(()=>{
      const src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="green"/></svg>');
      const f=document.createElement('iframe');f.srcdoc=TravelCanopyDocument(Array.from({length:4},(_,i)=>({id:String(i),title:'北京',src,full:src,aspect:1,year:2026})));document.querySelector('#host').append(f);
    });
    const f=page.frames().find(x=>x!==page.mainFrame());await f.waitForFunction(()=>window.canopy);await f.evaluate(()=>canopy.ready);
    const result=await f.evaluate(()=>{
      const s=canopy.scene;s.setRunning(false);s.common.uSway.value=0;
      s.camera.position.set(0,5,12);s.camera.lookAt(0,5,0);s.camera.updateMatrixWorld(true);
      const positions=[[0,5,0],[0,5,4],[6,5,0],[0,5,-4]];
      s.cards.forEach((c,i)=>{c.photo.rest.set(...positions[i]);c.group.position.copy(c.photo.rest);c.group.rotation.set(0,0,0);c.group.scale.setScalar(1);});
      const snapshot=()=>s.cards.map(c=>({p:c.group.position.toArray(),scale:c.group.scale.toArray()}));
      const before=snapshot();s.setSelected(s.cards[0].photo);const selected=s.cards.map(c=>c.group.visible);
      s.scene.updateMatrixWorld(true);
      const hit=s.pick(s.rect.left+s.rect.width/2,s.rect.top+s.rect.height/2);
      s.camera.position.set(12,5,0);s.camera.lookAt(0,5,0);s.cards.forEach(c=>c.group.rotation.y=Math.PI/2);s._updatePhotoOcclusion();const rotated=s.cards.map(c=>c.group.visible);
      s.camera.position.set(0,5,12);s.camera.lookAt(0,5,0);s.cards.forEach(c=>c.group.rotation.y=0);s._updatePhotoOcclusion();const returned=s.cards.map(c=>c.group.visible);
      s.setSelected(s.cards[2].photo);const switched=s.cards.map(c=>c.group.visible);
      s.setSelected(null);const restored=s.cards.map(c=>c.group.visible);
      return {selected,rotated,returned,picked:hit?.photo===s.cards[0].photo,switched,restored,before,after:snapshot()};
    });
    assert.deepEqual(result.selected,[true,false,true,true]);
    assert.equal(result.picked,true,'隐藏照片不能继续挡住选中照片的点击');
    assert.deepEqual(result.rotated,[true,true,false,true],'转动视角后只隐藏新的前方遮挡照片');
    assert.deepEqual(result.returned,[true,false,true,true]);
    assert.deepEqual(result.switched,[true,true,true,true]);
    assert.deepEqual(result.restored,[true,true,true,true]);
    assert.deepEqual(result.after,result.before);
  }finally{await browser.close();}
});
