const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const embedded=path.join(root,'assets/travel-ring-tree/embedded.js');
async function fixture(page,records,{expand=true}={}){
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'travel-ring-tree-'));
  fs.writeFileSync(path.join(folder,'index.html'),'<meta charset="utf-8"><div id="stage" style="position:fixed;inset:0"></div>');
  await page.goto(require('node:url').pathToFileURL(path.join(folder,'index.html')).href);
  await page.addScriptTag({path:embedded});
  await page.evaluate(records=>{const frame=document.createElement('iframe');frame.style.cssText='width:100%;height:100%;border:0';frame.srcdoc=TravelRingTreeDocument(records);document.querySelector('#stage').append(frame);},records);
  const f=page.frames().find(f=>f!==page.mainFrame());
  await f.waitForFunction(()=>window.travelTree);await f.evaluate(()=>travelTree.ready);
  if(expand&&await f.locator('#city-toggle').count())await f.locator('#city-toggle').click();
  return {f,folder};
}
function records(){const src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="500"><rect width="300" height="500" fill="#458c73"/></svg>');return ['北京','北京','杭州'].map((title,i)=>({id:'city'+(i===2?2:1)+':'+i,cityKey:i===2?'hz':'bj',title,year:i===0?2022:2026,date:i===0?'2022':'2026',src,full:src,aspect:3/5}));}

test('电脑端城市面板三个操作按钮尺寸一致，展开收起不变形',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),{f}=await fixture(page,records(),{expand:false});
    for(const expanded of [false,true,false]){
      if(expanded!==await f.locator('#city-nav').isVisible())await f.locator('#city-toggle').click();
      const sizes=await f.evaluate(()=>['whole-view','city-layout','city-toggle'].map(id=>{const b=document.getElementById(id),r=b.getBoundingClientRect(),s=getComputedStyle(b);return {width:r.width,height:r.height,font:s.fontSize,padding:s.padding};}));
      assert.deepEqual(sizes[1],sizes[0]);assert.deepEqual(sizes[2],sizes[0]);
      assert.equal(await f.locator('#city-toggle').textContent(),expanded?'收起城市':'显示城市');
    }
  }finally{await browser.close();}
});

test('电脑端年份仅刻一次大字，文字贴合台面且选中暖光明显增强',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));
    const rs=[2003,2022,2023,2024,2025,2026].map((year,i)=>({...records()[0],id:'year:'+i,year})),{f,folder}=await fixture(page,rs,{expand:false});
    const result=await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);s.setYear(2025);s.camera.position.set(0,12,18);s.controls.target.set(0,1,0);s.controls.update();s.renderer.render(s.scene,s.camera);s.scene.updateMatrixWorld(true);
      const tiers=s.scene.getObjectByName('travel-year-platform').children.filter(m=>m.geometry.type==='CylinderGeometry');
      return [...s.yearLabels].map(([year,label])=>{
        const p=label.geometry.attributes.position,v=label.position.clone(),quadrants=new Set();let clear=true;
        for(let i=0;i<p.count;i++){v.set(p.getX(i),p.getY(i),p.getZ(i));label.localToWorld(v);quadrants.add((v.x>=0?1:0)+(v.z>=0?2:0));const radius=Math.hypot(v.x,v.z);clear&&=tiers.every(t=>radius>t.geometry.parameters.radiusTop||v.y>t.position.y+t.geometry.parameters.height/2);}
        const ink=label.material.map.image.getContext('2d'),data=ink.getImageData(0,0,256,80).data;let min=80,max=0;
        for(let y=0;y<80;y++)for(let x=0;x<256;x++)if(data[(y*256+x)*4+3]>100){min=Math.min(min,y);max=Math.max(max,y);}
        const edge=p=>[p.getX(1)-p.getX(0),p.getZ(1)-p.getZ(0),p.getX(2)-p.getX(0),p.getZ(2)-p.getZ(0)],e=edge(p);
        return {year,quadrants:quadrants.size,clear,inkHeight:max-min,vertices:p.count,frontUp:e[1]*e[2]-e[0]*e[3]>0};
      });
    });
    assert.ok(result.every(r=>r.vertices===6),'每道年轮仅保留一个年份，不再重复刻字');
    assert.ok(result.every(r=>r.clear),'整圈文字不得嵌进较高台阶');assert.ok(result.every(r=>r.inkHeight>=40),'字形实际高度明显增加');
    assert.ok(result.every(r=>r.frontUp),'年份文字正面朝上，不得镜像倒置');
    const contrast=await f.evaluate(()=>{const s=travelTree.scene,glow=s.yearRings.get(2025).children[0];s.renderer.render(s.scene,s.camera);const a=new Uint8Array(s.rect.width*s.rect.height*4);s.renderer.getContext().readPixels(0,0,s.rect.width,s.rect.height,6408,5121,a);glow.visible=false;s.renderer.render(s.scene,s.camera);const b=new Uint8Array(a.length);s.renderer.getContext().readPixels(0,0,s.rect.width,s.rect.height,6408,5121,b);let changed=0;for(let i=0;i<a.length;i+=4)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>65)changed++;glow.visible=true;s.renderer.render(s.scene,s.camera);return changed;});
    assert.ok(contrast>400,'选中整圈应有明显的可见像素变化');
    await page.screenshot({path:path.join(folder,'year-ring-large-type.png')});console.log('环形大字截图：'+path.join(folder,'year-ring-large-type.png'));assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});

test('电脑端年份仅定位一次，底座城市轨迹按日期排列并随年份切换',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const rs=[['c','丙市','2026-09-02'],['a','甲市','2026-01-03'],['b','乙市','2026-05-01'],['d','丁市','2026'],['e','戊市','2025-01-01']].map(([cityKey,title,date],i)=>({...records()[0],id:cityKey+':'+i,cityKey,title,date,year:Number(date.slice(0,4))}));
    rs.push({...rs[1],id:'a:late',date:'2026-12-01'});
    const {f,folder}=await fixture(page,rs,{expand:false});
    for(const grouped of [false,true]){
      const result=await f.evaluate(grouped=>{
        const s=travelTree.scene;s.setRunning(false);s.setClusterMode(grouped);const positions=s.cards.map(c=>c.group.position.toArray());s.flyToYear(2026);
        s._updateFlight(s.flight.start+s.flight.dur+1);const target=s.controls.target.toArray();
        for(let n=0;n<10;n++)s._updateCards(1);
        const fixed=!s.flight&&target.every((v,i)=>v===s.controls.target.toArray()[i]);
        const stable=JSON.stringify(positions)===JSON.stringify(s.cards.map(c=>c.group.position.toArray()));
        const route=s.yearRoutes?.get(2026),order=route?.userData.cities.map(c=>c.id),shown=route?.visible;
        const labels=route?.getObjectByName('year-route-city-names'),p=labels?.geometry.attributes.position;
        const tiers=s.scene.getObjectByName('travel-year-platform').children.filter(m=>m.geometry.type==='CylinderGeometry');
        let clear=!!p,frontUp=!!p;
        if(p)for(let i=0;i<p.count;i++){const r=Math.hypot(p.getX(i),p.getZ(i));clear&&=tiers.every(t=>r>t.geometry.parameters.radiusTop||p.getY(i)>t.position.y+t.geometry.parameters.height/2);if(i%6===0)frontUp&&=(p.getZ(i+1)-p.getZ(i))*(p.getX(i+2)-p.getX(i))-(p.getX(i+1)-p.getX(i))*(p.getZ(i+2)-p.getZ(i))>0;}
        s.setYear(2025);const switched=!!s.yearRoutes?.get(2025).visible&&!route?.visible;
        s.setYear(null);const natural=s.yearRoutes&&[...s.yearRoutes.values()].every(r=>!r.visible);
        return {fixed,stable,order,shown,switched,natural,clear,frontUp};
      },grouped);
      assert.equal(result.fixed,true,'定位结束后不会每三秒飞向下一城');
      assert.deepEqual(result,{fixed:true,stable:true,order:['a','b','c','d'],shown:true,switched:true,natural:true,clear:true,frontUp:true});
    }
    await f.locator('[data-year="2026"]').click();
    await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);s._updateFlight(s.flight.start+s.flight.dur+1);});
    await f.locator('[data-year="2026"]').click();await f.locator('#scene').dispatchEvent('pointerdown',{button:0,pointerId:7,clientX:10,clientY:10});await f.locator('#scene').dispatchEvent('pointerup',{button:0,pointerId:7,clientX:10,clientY:10});
    assert.equal(await f.evaluate(()=>!travelTree.scene.yearTransition&&!travelTree.scene.flight&&travelTree.scene.year===2026),true,'按下画布接管控制并保留所选年份');
    await f.locator('[data-year="2026"]').click();await f.locator('[data-year="2025"]').click();
    await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(s.flight.start+s.flight.dur+1);});
    assert.equal(await f.evaluate(()=>travelTree.scene.year),2025,'新年份替换旧定位');
    await f.locator('[data-year="all"]').click();assert.equal(await f.evaluate(()=>travelTree.scene.year===null),true);
    await f.locator('[data-year="2026"]').click();await f.locator('#city-toggle').click();await f.locator('[data-city="b"]').click();
    assert.equal(await f.evaluate(()=>!travelTree.scene.yearTransition&&travelTree.state.city.id==='b'),true,'城市选择接管年份定位');
    await f.evaluate(()=>{const s=travelTree.scene;s.setYear(2026);s.camera.position.set(0,12,18);s.controls.target.set(0,1,0);s.controls.update();s.renderer.render(s.scene,s.camera);});
    await page.screenshot({path:path.join(folder,'year-city-route.png')});console.log('年度城市轨迹截图：'+path.join(folder,'year-city-route.png'));
  }finally{await browser.close();}
});

test('电脑端年轮城市刻字放大并加深，仍贴合台面',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),rs=[];
    for(const year of [2003,2022,2023,2024,2025,2026])for(const [i,title] of ['北京市','杭州市','景德镇市'].entries())rs.push({...records()[0],id:year+':'+i,cityKey:'city'+i,title,year,date:String(year)});
    const {f,folder}=await fixture(page,rs,{expand:false});
    const result=await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);s.setYear(2024);
      const tiers=s.scene.getObjectByName('travel-year-platform').children.filter(m=>m.geometry.type==='CylinderGeometry');
      return [...s.yearRoutes.values()].map(route=>{
        const label=route.getObjectByName('year-route-city-names'),p=label.geometry.attributes.position;
        const height=Math.hypot(p.getX(1)-p.getX(0),p.getZ(1)-p.getZ(0));let clear=true,dark=255;
        for(let i=0;i<p.count;i++){const r=Math.hypot(p.getX(i),p.getZ(i));clear&&=tiers.every(t=>r>t.geometry.parameters.radiusTop||p.getY(i)>t.position.y+t.geometry.parameters.height/2);}
        const canvas=label.material.map.image,data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
        for(let i=0;i<data.length;i+=4)if(data[i+3]>240)dark=Math.min(dark,data[i]);
        return {height,clear,dark};
      });
    });
    assert.ok(result.every(r=>r.height>=.58&&r.height<=.64),'字面较原来的0.48放大约25%至30%');
    assert.ok(result.every(r=>r.dark<65),'字形主体应为高对比深棕色');assert.ok(result.every(r=>r.clear),'放大后的城市文字不能嵌入较高台阶');
    await f.evaluate(()=>{const s=travelTree.scene;s.camera.position.set(0,12,18);s.controls.target.set(0,1,0);s.controls.update();s.renderer.render(s.scene,s.camera);});
    await page.screenshot({path:path.join(folder,'city-type-larger.png')});console.log('城市刻字截图：'+path.join(folder,'city-type-larger.png'));
  }finally{await browser.close();}
});

test('电脑端底座城市轨迹密集时仍为年份文字预留空间',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const rs=Array.from({length:24},(_,i)=>({...records()[0],id:'dense:'+i,cityKey:'dense'+i,title:'城市'+i,year:2003,date:'2003'}));
    for(const year of [2022,2023,2024,2025,2026])rs.push({...records()[0],id:'year:'+year,cityKey:'year'+year,year,date:String(year)});
    const {f}=await fixture(page,rs,{expand:false});
    const separated=await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);s.setYear(2003);
      const polygon=(p,i)=>[0,1,4,2].map(j=>[p.getX(i+j),p.getZ(i+j)]);
      const overlaps=(a,b)=>[a,b].every(poly=>poly.every((v,i)=>{
        const next=poly[(i+1)%4],axis=[next[1]-v[1],v[0]-next[0]];
        const pa=a.map(p=>p[0]*axis[0]+p[1]*axis[1]),pb=b.map(p=>p[0]*axis[0]+p[1]*axis[1]);
        return Math.max(...pa)>Math.min(...pb)&&Math.max(...pb)>Math.min(...pa);
      }));
      const year=polygon(s.yearLabels.get(2003).geometry.attributes.position,0),p=s.yearRoutes.get(2003).getObjectByName('year-route-city-names').geometry.attributes.position;
      for(let i=0;i<p.count;i+=6)if(overlaps(year,polygon(p,i)))return false;
      return p.count===24*6;
    });
    assert.equal(separated,true,'首末城市不能与年份刻字重叠');
  }finally{await browser.close();}
});

test('电脑端底座年份年轮暖光与照片同步，全部恢复自然且不重排',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const {f,folder}=await fixture(page,records(),{expand:false});
    const original=await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);
      return {positions:s.cards.map(c=>c.group.position.toArray()),rings:[...s.yearRings].map(([year,r])=>({year,radius:r.geometry.parameters.radius,color:r.material.color.getHex()}))};
    });
    assert.deepEqual(original.rings.map(r=>r.year),[2022,2026]);assert.ok(original.rings[0].radius<original.rings[1].radius,'旧年份在内，新年份在外');
    assert.equal(await f.evaluate(()=>[...travelTree.scene.yearRings.values()].every(r=>r.children.some(g=>g.name==='year-ring-warm-glow'&&!g.visible))),true,'默认全部没有发光');
    await f.evaluate(()=>travelTree.scene.setRunning(true));await f.locator('[data-year="2022"]').click();
    await f.waitForFunction(()=>travelTree.scene.year===2022&&!travelTree.scene.yearTransition);
    const selected=await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);s.renderer.render(s.scene,s.camera);
      return {glowing:[...s.yearRings].filter(([,r])=>r.children.some(g=>g.name==='year-ring-warm-glow'&&g.visible)).map(([y])=>y),positions:s.cards.map(c=>c.group.position.toArray()),bright:s.cards.filter(c=>c.mat.color.r>.9).map(c=>c.photo.year)};
    });
    assert.deepEqual(selected.glowing,[2022],'只点亮所选年份的底座环');assert.deepEqual(selected.bright,[2022]);assert.deepEqual(selected.positions,original.positions,'年份联动不能重排照片');
    await f.evaluate(()=>{const s=travelTree.scene;s.camera.position.set(0,10,18);s.controls.target.set(0,1,0);s.controls.update();s.renderer.render(s.scene,s.camera);});
    await page.screenshot({path:path.join(folder,'year-ring-warm-glow.png')});console.log('底座暖光截图：'+path.join(folder,'year-ring-warm-glow.png'));
    await f.locator('[data-year="all"]').click();
    const restored=await f.evaluate(()=>{
      const s=travelTree.scene;
      return {natural:[...s.yearRings.values()].every(r=>r.children.every(g=>!g.visible)),colors:[...s.yearRings.values()].map(r=>r.material.color.getHex()),positions:s.cards.map(c=>c.group.position.toArray()),bright:s.cards.every(c=>c.mat.color.r>.9)};
    });
    assert.equal(restored.natural,true);assert.deepEqual(restored.colors,original.rings.map(r=>r.color));assert.equal(restored.bright,true);assert.deepEqual(restored.positions,original.positions);
    assert.deepEqual(errors,[],'暖光着色器及页面不得有渲染错误');
  }finally{await browser.close();}
});

test('电脑端三根城市绳独立拖动、摆角增大且分别回稳',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
    const rs=Array.from({length:21},(_,i)=>({...records()[0],id:'bj:'+i,year:2026}));
    const {f}=await fixture(page,rs,{expand:false});await f.locator('#city-layout').click();
    const box=await page.locator('iframe').boundingBox();
    for(let column=0;column<3;column++){
      const point=await f.evaluate(column=>{
        const s=travelTree.scene,c=s.cityClusters[0];s.setRunning(false);s.flight=null;s.controls.enabled=true;
        const view=s.storyView(c.city);s.camera.position.copy(view.pos);s.controls.target.copy(view.target);s.controls.update();s.camera.updateMatrixWorld(true);s.scene.updateMatrixWorld(true);
        const a=c.tails.geometry.attributes.position,i=column*2,p=c.group.position.clone().set(a.getX(i),(a.getY(i)+a.getY(i+1))/2,a.getZ(i));c.group.localToWorld(p);p.project(s.camera);
        const x=(p.x+1)*s.rect.width/2+s.rect.left,y=(1-p.y)*s.rect.height/2+s.rect.top;
        s.renderer.render(s.scene,s.camera);return {x,y,hit:s.pick(x,y)?.rope?.x,restX:a.getX(i)};
      },column);
      assert.ok(Math.abs(point.hit-point.restX)<.001,'命中具体绳列而不是整城');
      const before=await f.evaluate(()=>travelTree.scene.camera.position.toArray());
      await page.mouse.move(point.x+box.x,point.y+box.y);await page.mouse.down();await page.mouse.move(point.x+box.x+180,point.y+box.y,{steps:4});
      const result=await f.evaluate(column=>{
        const s=travelTree.scene,c=s.cityClusters[0];s._updateHanging(.016);
        const a=c.tails.geometry.attributes.position,i=column*2,angle=Math.atan2(a.getX(i+1)-a.getX(i),a.getY(i)-a.getY(i+1));
        return {counts:Array.from({length:3},(_,j)=>c.cards.filter(p=>Math.abs(p.hangingRest.x-c.tailRest[j*6])<.001&&p.group.position.distanceTo(p.hangingRest)>.001).length),angle,travel:Math.abs(a.getX(i+1)-c.tailRest[(i+1)*3]),label:c.label.position.x,top:c.strings.geometry.attributes.position.getX(column*24)-c.stringRest[column*72],lamps:s.hangingLanterns.filter(l=>l.city===c.city).every(l=>(l.group.position.distanceTo(l.hangingRest)>.001)===(Math.abs(l.card.hangingRest.x-c.tailRest[column*6])<.001)),plaqueLamp:s.plaqueLanterns.find(l=>l.city===c.city).group.position.x};
      },column);
      assert.deepEqual(result.counts,[0,1,2].map(j=>j===column?7:0),'只移动被抓绳上的七张照片');
      assert.ok(result.angle>.04&&result.angle<=Math.PI/12+.001&&result.travel>.8,'摆角显著增大但不超过十五度');
      assert.equal(result.label,0,'城市牌匾不被单列拉动');assert.ok(Math.abs(result.top)<.00001,'树冠端固定');
      assert.equal(result.lamps,true,'只带动该绳上的吊灯');assert.equal(result.plaqueLamp,0,'牌匾上方吊灯不被单列拉动');
      assert.deepEqual(await f.evaluate(()=>travelTree.scene.camera.position.toArray()),before);
      await page.mouse.up();assert.equal(await f.locator('#photo-dialog').isVisible(),false);
      assert.equal(await f.evaluate(()=>{const s=travelTree.scene;for(let i=0;i<600;i++)s._updateHanging(1/60);return s.cityClusters[0].cards.every(c=>c.group.position.distanceTo(c.hangingRest)<.001)&&s.controls.enabled;}),true);
    }
    const independent=await f.evaluate(()=>{
      const s=travelTree.scene,c=s.cityClusters[0];s.beginRopeDrag(c.ropes[0],720,500);s.moveRopeDrag(800,500);s._updateHanging(.016);s.endRopeDrag();
      s.beginRopeDrag(c.ropes[1],720,500);s.moveRopeDrag(640,500);s._updateHanging(.016);
      const result=c.ropes[0].angle>0&&c.ropes[1].angle<0&&c.ropes[2].angle===0;s.endRopeDrag();return result;
    });
    assert.equal(independent,true,'先前松手的绳继续独立回弹，不被下一根覆盖');
  }finally{await browser.close();}
});

test('电脑端拖绳打断年份取景仍保留所选年份',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),{f}=await fixture(page,records(),{expand:false});
    const result=await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);s.setClusterMode(true);s.flyToYear(2022);s.beginRopeDrag(s.cityClusters[0].ropes[0],720,500);const year=s.year;s.endRopeDrag();return {year,pending:!!s.yearTransition,controls:s.controls.enabled};});
    assert.deepEqual(result,{year:2022,pending:false,controls:true},'抓绳取消取景，但不能取消用户选择的年份');
  }finally{await browser.close();}
});

test('电脑端城市短绳：拖动单列、固定冠层连接、松手回稳且不误开照片',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),{f}=await fixture(page,records());
    await f.locator('#city-layout').click();
    const point=await f.evaluate(()=>{
      const s=travelTree.scene,c=s.cityClusters[0];s.setRunning(false);s.controls.enabled=true;s.flight=null;
      const view=s.storyView(c.city);s.camera.position.copy(view.pos);s.controls.target.copy(view.target);s.controls.update();s.camera.updateMatrixWorld(true);s.scene.updateMatrixWorld(true);
      if(!c.tails)return null;
      const a=c.tails.geometry.attributes.position,card=c.cards.slice().sort((a,b)=>a.hangingRest.y-b.hangingRest.y)[0];
      const length=a.getY(0)-a.getY(1);if(Math.abs(length-card.photo.h*card.layoutScale/3)>.001)throw Error('短绳长度应为照片高度三分之一');
      const p=c.group.position.clone().set(a.getX(0),(a.getY(0)+a.getY(1))/2,a.getZ(0));c.group.localToWorld(p);p.project(s.camera);
      s.renderer.render(s.scene,s.camera);return {x:(p.x+1)*s.rect.width/2+s.rect.left,y:(1-p.y)*s.rect.height/2+s.rect.top,hit:s.pick((p.x+1)*s.rect.width/2+s.rect.left,(1-p.y)*s.rect.height/2+s.rect.top)?.rope?.cluster.city.id};
    });
    assert.ok(point,'城市底部需要可抓取的短绳');assert.equal(point.hit,'bj','短绳应能被鼠标命中');
    const box=await page.locator('iframe').boundingBox();point.x+=box.x;point.y+=box.y;
    const before=await f.evaluate(()=>travelTree.scene.camera.position.toArray());
    await page.mouse.move(point.x,point.y);await page.mouse.down();await page.mouse.move(point.x+45,point.y,{steps:5});
    const motion=await f.evaluate(()=>{const s=travelTree.scene;s._updateHanging(.016);const c=s.cityClusters[0];return {cameraPaused:!s.controls.enabled,moved:c.cards.map(p=>Math.abs(p.group.position.x-p.hangingRest.x)>.01),top:c.strings.geometry.attributes.position.getX(0)-c.stringRest[0],others:s.cityClusters[1].cards.every(p=>p.group.position.equals(p.hangingRest))};});
    assert.equal(motion.cameraPaused,true);assert.deepEqual(motion.moved,[true,true]);assert.ok(Math.abs(motion.top)<.00001,'浮点几何的顶部连接保持固定');assert.equal(motion.others,true,'其他城市不动');
    assert.deepEqual(await f.evaluate(()=>travelTree.scene.camera.position.toArray()),before,'拉绳不能转动相机');
    await page.mouse.up();
    assert.equal(await f.evaluate(()=>travelTree.scene.controls.enabled),true);
    assert.equal(await f.locator('#photo-dialog').isVisible(),false,'松手不误触照片或城市选择');
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene;for(let i=0;i<600;i++)s._updateHanging(1/60);return s.cityClusters[0].cards.every(c=>c.group.position.distanceTo(c.hangingRest)<.001);}),true,'摆动逐渐回到原位');
    await f.evaluate(()=>{const s=travelTree.scene;s.setRotation(true,1,2);s.flyTo(s.storyView(s.cityClusters[0].city),1);});
    await page.mouse.move(point.x,point.y);await page.mouse.down();
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene;s._updateHanging(.016);return !!s.ropeDrag&&!s.controls.autoRotate&&!s.flight;}),true,'抓绳期间暂停自动旋转并取消正在进行的取景');
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene,r=s.ropeDrag.rope;s.endRopeDrag();s.controls.autoRotate=true;for(let i=0;i<20;i++)s.controls.update(1/60);s.beginRopeDrag(r,s.rect.width/2,s.rect.height/2);const camera=s.camera.position.clone(),target=s.controls.target.clone();for(let i=0;i<3;i++)s.frame();return s.camera.position.distanceTo(camera)<.000001&&s.controls.target.distanceTo(target)<.000001;}),true,'真实帧更新不能让相机惯性或取景约束继续移动视角');
    await f.locator('#scene').dispatchEvent('pointercancel');await page.mouse.up();
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene;s._updateHanging(.016);return !s.ropeDrag&&s.controls.enabled&&s.controls.autoRotate&&s.rotationSpeed===2;}),true,'取消拖动也恢复相机及原有旋转设置');
    await f.evaluate(()=>{const s=travelTree.scene;s.setRotation(false,1,1);s.hangingAmplitude=0;s._updateHanging(.016);s.renderer.render(s.scene,s.camera);});
  }finally{await browser.close();}
});

for(const width of [1440,390])test((width===1440?'电脑端':'手机端')+'春日花树：六种花稀疏点缀且不遮照片',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),{f,folder}=await fixture(page,records());
    const m=await f.evaluate(()=>{
      const s=travelTree.scene,flowers=['sakura','magnolia','camellia','violet','daisy','yellow'].map(name=>s.tree.getObjectByName('tree-crown-'+name)),buds=s.tree.getObjectByName('tree-crown-buds');
      if(flowers.some(m=>!m)||!buds)return {exists:false};
      const batches=flowers.map(mesh=>{
        mesh.computeBoundingBox();mesh.geometry.computeBoundingBox();
        const a=mesh.instanceMatrix.array,radii=Array.from({length:mesh.count},(_,i)=>Math.hypot(a[i*16+12],a[i*16+14]));
        const size=mesh.geometry.boundingBox;
        const normals=mesh.geometry.attributes.normal;
        return {count:mesh.count,core:radii.filter(r=>r<6.9).length,edge:radii.filter(r=>r>13.8).length,instanced:mesh.isInstancedMesh,depth:size.max.y-size.min.y,colors:!!mesh.geometry.attributes.color,width:size.max.x-size.min.x,radius:Math.max(...radii),min:mesh.boundingBox.min.y,vertices:mesh.geometry.attributes.position.count,lightFacing:Array.from({length:normals.count},(_,i)=>normals.getY(i)).reduce((a,b)=>a+b,0)/normals.count};
      });
      buds.computeBoundingBox();
      const leaves=s.tree.getObjectByName('tree-leaf-crown').instanceMatrix.array;
      let attachmentGap=0;
      for(const mesh of [...flowers,buds])for(let i=0;i<mesh.count;i++){
        const a=mesh.instanceMatrix.array,o=i*16;let nearest=Infinity;
        for(let j=0;j<leaves.length;j+=16)nearest=Math.min(nearest,Math.hypot(a[o+12]-leaves[j+12],a[o+13]-leaves[j+13],a[o+14]-leaves[j+14]));
        attachmentGap=Math.max(attachmentGap,nearest);
      }
      const points=flowers.flatMap(mesh=>Array.from({length:mesh.count},(_,i)=>{const a=mesh.instanceMatrix.array,o=i*16,b=mesh.geometry.boundingBox,scale=Math.hypot(a[o],a[o+1],a[o+2]);return [a[o+12]/1.15,a[o+14]/1.15,Math.max(Math.abs(b.min.x),Math.abs(b.max.x),Math.abs(b.min.z),Math.abs(b.max.z))*scale/1.15];}));
      let gap=0,bare=0,samples=0;
      for(let x=-15;x<=15;x++)for(let z=-15;z<=15;z++)if(Math.hypot(x,z)<=15){const distance=Math.min(...points.map(p=>Math.hypot(x-p[0],z-p[1])));gap=Math.max(gap,distance);samples++;if(points.every(p=>Math.hypot(x-p[0],z-p[1])>p[2]+.2))bare++;}
      return {exists:true,batches,buds:buds.count,attachmentGap,gap,bare:bare/samples,clearance:Math.min(...batches.map(m=>m.min),buds.boundingBox.min.y)*s.tree.scale.y-Math.max(...s.photos.map(p=>p.rest.y+p.h/2)),scale:s.tree.scale.toArray()};
    });
    assert.equal(m.exists,true,'六种花均有少量点缀，包括白色雏菊和淡黄小花');
    assert.ok(m.batches.every(b=>b.instanced&&b.depth>.2&&b.colors&&b.width>1),'实际曲面花瓣而非平面贴图，花朵远看足够大');
    assert.ok(m.batches.every(b=>b.lightFacing>.1),'花瓣正面朝向日光，不能反向受光变成灰花');
    assert.ok(new Set(m.batches.map(b=>b.vertices)).size>=4,'新增花型不能仅是同一花朵换色');
    const count=m.batches.reduce((n,b)=>n+b.count,0);
    assert.ok(m.attachmentGap<.06,'花底贴住真实叶面，不能悬空：'+m.attachmentGap);
    const target=width===1440?450:180,edge=m.batches.reduce((n,b)=>n+b.edge,0),core=m.batches.reduce((n,b)=>n+b.core,0);
    assert.deepEqual([m.batches[1].count,m.batches[2].count],width===1440?[27,51]:[11,20],'玉兰与山茶不增加，仅新增小花');
    assert.ok(core<count*.07,'树顶仅保留零星小花，主要分布在周围坡面：'+core);
    assert.equal(m.batches[1].core+m.batches[2].core,0,'玉兰、山茶等大花不堆在树顶');
    assert.ok(count===target&&m.buds>0&&m.buds<count*.15,'桌面450朵，手机适配减量，六种花保留：'+count);
    assert.ok(edge<count*.2,'外缘只留几朵：'+edge);
    assert.ok(m.bare>.1&&m.gap<9,'增加花量后仍保留绿叶间隙：'+m.bare);
    assert.ok(m.batches.every(b=>b.radius<20)&&m.clearance>1,'装饰不侵入照片空间');
    assert.deepEqual(m.scale,[1,.8,1]);
    await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);s.renderer.render(s.scene,s.camera);});
    const shot=path.join(folder,'flower-tree-'+width+'.png');await page.screenshot({path:shot});console.log('花树预览：'+shot);
  }finally{await browser.close();}
});

test('电脑端城市目录默认收起、按年份展示，年份定位正前方并停止旋转，全部牌匾常亮',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f}=await fixture(page,records(),{expand:false});
    assert.equal(await f.locator('#city-nav').isVisible(),false,'首次进入不展示城市名');
    await f.locator('#city-toggle').click();assert.equal(await f.locator('#city-nav').isVisible(),true);
    for(const grouped of [false,true]){
      if(grouped)await f.locator('#city-layout').click();
      await f.locator('#rotation-toggle').click();await f.locator('[data-year="2022"]').click();
      const nav=await f.locator('#city-nav [data-city]').evaluateAll(bs=>bs.map(b=>b.dataset.city));assert.deepEqual(nav,['bj']);
      assert.equal(await f.evaluate(()=>travelTree.state.rotating||travelTree.scene.rotationActive),false);
      assert.equal(await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);const p=s.cards.find(c=>c.photo.year===2022);s.scene.updateMatrixWorld(true);const v=p.group.getWorldPosition(s._clusterPoint),off=s.camera.position.clone().sub(s.controls.target);return Math.abs(s.controls.target.x-v.x)<.01&&Math.abs(s.controls.target.z-v.z)<.01&&(off.x*v.x+off.z*v.z)/(Math.hypot(off.x,off.z)*Math.hypot(v.x,v.z))>.99;}),true,'锁定该年照片前方，而不是仅旋转整树');
      await f.locator('[data-year="all"]').click();assert.equal(await f.locator('#city-nav [data-city]').count(),2);
      assert.equal(await f.evaluate(()=>travelTree.scene.plaqueLanterns.every(l=>l.tag.material.color.r===1)),true);
      await f.locator('[data-city="bj"]').click();await f.locator('[data-year="all"]').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
      assert.equal(await f.evaluate(()=>travelTree.scene.plaqueLanterns.every(l=>l.tag.material.color.r===1)),true,'全部也清除单城市聚焦');
    }
    await f.locator('#city-toggle').click();assert.equal(await f.locator('#city-nav').isVisible(),false);await f.locator('[data-year="2026"]').click();assert.equal(await f.locator('#city-nav').isVisible(),false,'切换年份不自动展开目录');
  }finally{await browser.close();}
});

test('电脑端右侧照片面板：树场景保留、同城切换与缩略图同步，关闭恢复取景',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f,folder}=await fixture(page,records());
    for(const grouped of [false,true]){
      if(grouped)await f.locator('#city-layout').click();
      await f.locator('[data-city="bj"]').click();
      await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);window.panelView={pos:s.camera.position.toArray(),target:s.controls.target.toArray()};window.panelRest=s.cards.map(c=>c.photo.rest.toArray());});
      await f.locator('#city-photos button').first().click();
      const panel=await f.locator('#photo-dialog').boundingBox();
      assert.ok(panel.x>=1040&&panel.width<=400,'面板只占右侧，不遮住整个树场景');
      assert.equal(await f.locator('#photo-count').textContent(),'1 / 2');assert.equal(await f.locator('#photo-strip button').count(),2);
      assert.equal(await f.locator('#photo-strip button[aria-pressed="true"]').count(),1);
      assert.equal(await f.evaluate(()=>travelTree.scene.insetTarget.right),400);
      const closeUp=await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);s._applyInset(1);const c=s.cards.find(c=>c.photo===travelTree.state.photo);s.scene.updateMatrixWorld(true);return {target:s.controls.target.toArray(),photo:c.group.getWorldPosition(s._clusterPoint).toArray()};});
      assert.ok(closeUp.target.every((v,i)=>Math.abs(v-closeUp.photo[i])<.01),'取景使用当前布局实际照片坐标');
      await f.locator('#photo-next').click();assert.equal(await f.locator('#photo-count').textContent(),'2 / 2');assert.equal(await f.evaluate(()=>travelTree.state.photo.year),2026);
      await f.locator('#photo-strip button').first().click();assert.equal(await f.locator('#photo-count').textContent(),'1 / 2');
      await f.locator('#photo-prev').click();assert.equal(await f.locator('#photo-count').textContent(),'2 / 2');
      await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);s.renderer.render(s.scene,s.camera);});
      await page.screenshot({path:path.join(folder,grouped?'panel-grouped.png':'panel-natural.png')});
      await f.locator('#photo-close').click();assert.equal(await f.locator('#photo-dialog').isVisible(),false);
      assert.equal(await f.evaluate(()=>travelTree.scene.insetTarget.right),0);
      assert.equal(await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);return s.camera.position.toArray().every((v,i)=>Math.abs(v-panelView.pos[i])<.01)&&s.controls.target.toArray().every((v,i)=>Math.abs(v-panelView.target[i])<.01)&&s.cards.every((c,i)=>c.photo.rest.toArray().every((v,j)=>v===panelRest[i][j]));}),true,'关闭恢复打开前取景且照片位置不变');
    }
    console.log('右侧照片面板预览：'+folder);
  }finally{await browser.close();}
});

test('电脑端年份同时点亮对应城市牌匾，两种布局及未知年份保持一致',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const {f}=await fixture(page,[...records(),{...records()[0],id:'unknown:0',cityKey:'unknown',title:'未知城市',year:'年份未确定'}]);
    const brightness=()=>f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);s._updateFlight(performance.now()+2000);s._updateCards(1);return s.plaqueLanterns.map(l=>({id:l.city.id,tag:l.tag.material.color.r,label:s.cityClusters.find(c=>c.city===l.city).label.material.color.r}));});
    for(const grouped of [false,true]){
      if(grouped)await f.locator('#city-layout').click();
      for(const [year,bright] of [['2022',['bj']],['2026',['bj','hz']],['unknown',['unknown']],['all',['bj','hz','unknown']]]){
        await f.locator(`[data-year="${year}"]`).click();
        const values=await brightness();
        assert.deepEqual(values.filter(v=>v.tag===1).map(v=>v.id),bright,'自然布局牌匾跟随年份点亮');
        assert.deepEqual(values.filter(v=>v.label===1).map(v=>v.id),bright,'分类布局牌匾跟随年份点亮');
      }
    }
  }finally{await browser.close();}
});

test('电脑端左侧城市选择切回全部年份，取消待完成年份定位并展示城市全部照片',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),{f}=await fixture(page,records());
    for(const grouped of [false,true]){
      if(grouped){await f.locator('#city-layout').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));}
      await f.locator('[data-year="2022"]').click();
      // In grouped mode deliberately select a city while the year flight is still pending.
      await f.locator('[data-city="bj"]').click();
      await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);s._updateFlight(performance.now()+2000);s._updateCards(1);});
      assert.deepEqual(await f.evaluate(()=>[travelTree.state.year,travelTree.scene.year,travelTree.scene.yearTransition,travelTree.state.city.id]),[null,null,null,'bj']);
      assert.equal(await f.locator('[data-year="all"]').getAttribute('aria-pressed'),'true');
      assert.equal(await f.locator('[data-year="2022"]').getAttribute('aria-pressed'),'false');
      assert.equal(await f.locator('#city-photos button').count(),2,'显示北京跨年全部照片');
      assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.photo.story.id==='bj').every(c=>c.dim===0)),true);
      await f.locator('[data-year="2026"]').click();await f.locator('[data-city="hz"]').click();
      assert.equal(await f.locator('#city-photos button').count(),1,'所选年份没有照片的城市也可查看全部年份');
      assert.equal(await f.evaluate(()=>travelTree.state.year),null);
    }
  }finally{await browser.close();}
});

test('分类挂绳按每列最后可见照片收尾，年份筛选后仍只留短线',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const rs=Array.from({length:8},(_,i)=>({...records()[0],id:'bj:'+i,year:i<3?2022:2026,aspect:i%2?1.7:.65}));
    const {f}=await fixture(page,rs);await f.locator('#city-layout').click();
    const tails=()=>f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);const c=s.cityClusters[0],a=c.tails.geometry.attributes.position,rows=[];for(let i=0;i<a.count;i+=2){const photos=c.cards.filter(p=>p.group.visible&&Math.abs(p.hangingRest.x-a.getX(i))<.001).sort((a,b)=>a.hangingRest.y-b.hangingRest.y);const p=photos[0];rows.push({count:photos.length,tail:a.getY(i)-a.getY(i+1),height:p?.photo.h*p?.layoutScale});}return rows;});
    for(const row of await tails()){assert.ok(row.count>0);assert.ok(Math.abs(row.tail-row.height/3)<.001,'每列按最底照片高度保留三分之一短绳');}
    await f.evaluate(()=>travelTree.scene.setYear(2022));
    for(const row of await tails()){assert.ok(row.count>0,'没有可见照片的列不显示空挂绳');assert.ok(Math.abs(row.tail-row.height/3)<.001,'年份强调后仍按照片尺寸保留短绳');}
  }finally{await browser.close();}
});

test('电脑端年份常亮：其他年份只变暗，城市和照片不消失且位置稳定',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000}});
    const rs=[...records(),{...records()[0],id:'unknown:0',cityKey:'unknown',title:'未知城市',year:'年份未确定'}];
    const {f}=await fixture(page,rs);await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);window.yearRest=s.cards.map(c=>c.hangingRest.toArray());});
    await f.locator('[data-year="2022"]').click();assert.equal(await f.evaluate(()=>travelTree.scene.year),null,'保留先旋转定位的过程');
    await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    const result=await f.evaluate(()=>{const s=travelTree.scene;return {visible:s.cards.filter(c=>c.group.visible&&c.group.parent.visible).length,cities:s.cityClusters.filter(c=>c.group.visible).length,bright:s.cards.filter(c=>c.photo.year===2022).map(c=>c.mat.color.r),dark:s.cards.filter(c=>c.photo.year!==2022).map(c=>c.mat.color.r),stable:s.cards.every((c,i)=>c.hangingRest.toArray().every((v,j)=>v===yearRest[i][j]))};});
    assert.equal(result.visible,4,'其他年份照片仍展示');assert.equal(result.cities,3,'不属于该年的城市组也保持展示');
    assert.deepEqual(result.bright,[1]);assert.ok(result.dark.every(v=>v>0&&v<.5),'其他年份变暗而不是不可见');assert.equal(result.stable,true);
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene;s.hoveredCity=s.stories.find(c=>c.id==='hz');s._updateCards(1);return s.cards.find(c=>c.photo.year===2022).mat.color.r;}),1,'悬停其他城市也不能使所选年份失去常亮');
    await f.locator('[data-city="bj"]').click();assert.equal(await f.locator('#city-photos button').count(),2,'左侧城市选择恢复全部年份照片');
    await f.locator('[data-year="unknown"]').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.group.visible&&c.group.parent.visible).length),4);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.find(c=>c.photo.year==='年份未确定').mat.color.r),1);
    await f.locator('[data-year="all"]').click();await f.evaluate(()=>{const s=travelTree.scene;s.hoveredCity=null;s._updateFlight(performance.now()+2000);});
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.every(c=>c.mat.color.r===1)),true,'全部恢复正常亮度');
  }finally{await browser.close();}
});

test('电脑端年份内圈照片让位：仅隐藏遮挡照片，转动及全部恢复，保留手动圈层',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000},reducedMotion:'reduce'});
    const rs=Array.from({length:36},(_,i)=>Array.from({length:3},(_,j)=>({...records()[0],id:`yearblock${i}:${j}`,cityKey:`yearblock${i}`,title:`城市${i}`,year:j===0?2025:2026}))).flat();
    const {f}=await fixture(page,rs);await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    await f.locator('[data-year="2025"]').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);
      const inner=s.cityClusters.find(c=>c.ringIndex===1),front=s.cityClusters.find(c=>c.ringIndex===0);
      s.cityClusters.forEach(c=>c.group.position.set(100,24,-100));
      inner.group.position.set(0,24,11.6);front.group.position.set(0,24,15.8);
      for(const c of [inner,front]){c.group.rotation.y=0;c.cards.forEach((p,i)=>{p.hangingRest.set(i===0?0:i===1?8:-8,-2,0);p.group.position.copy(p.hangingRest);});}
      window.yearBlocks={inner,front};window.yearBlockRest=s.cards.map(c=>c.hangingRest.toArray());
      s.camera.position.set(0,24,45);s.controls.target.copy(inner.group.position);s.camera.lookAt(s.controls.target);s._updateCards(1);
    });
    assert.deepEqual(await f.evaluate(()=>yearBlocks.front.cards.map(c=>c.group.visible)),[false,true,true],'同年的外圈遮挡照片也让位，不隐藏同城市其他照片');
    assert.equal(await f.evaluate(()=>yearBlocks.front.group.visible&&yearBlocks.front.label.visible&&yearBlocks.inner.cards[0].group.visible),true,'城市牌匾与内圈目标保持展示');
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene,p=yearBlocks.front.cards[0],v=p.group.getWorldPosition(s._clusterPoint).clone().project(s.camera),r=s.rect;return s.pick(r.left+(v.x+1)*r.width/2,r.top+(1-v.y)*r.height/2)?.photo===p.photo;}),false,'隐藏照片不能抢占点击');
    assert.deepEqual(await f.evaluate(()=>{const s=travelTree.scene;s.camera.position.set(45,24,0);s.camera.lookAt(s.controls.target);s._updateCards(1);return yearBlocks.front.cards.map(c=>c.group.visible);}),[true,true,true],'视角改变后恢复不再遮挡的照片');
    await f.locator('[data-ring-toggle="0"]').click();await f.locator('[data-year="all"]').click();await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);s._updateCards(1);});
    assert.equal(await f.evaluate(()=>!yearBlocks.front.group.visible&&travelTree.scene.cards.every(c=>c.group.visible)),true,'全部清除临时照片隐藏，但保留用户手动隐藏外圈');
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.every((c,i)=>c.hangingRest.toArray().every((v,j)=>v===yearBlockRest[i][j]))),true,'不改变照片挂载位置');
  }finally{await browser.close();}
});

test('牌匾选中高亮、每城夜灯及照片整体上移半段空绳',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f,folder}=await fixture(page,records());
    const result=await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);
      const tags=s.scene.getObjectByName('travel-city-wood-tags').children;
      const defaultBright=tags.every(t=>t.material.color.r===1);
      const remaining=Math.min(...s.photos.map(p=>p.anchorY-p.rest.y-p.h/2-.2));
      const lamps=s.plaqueLanterns||[];
      s.setFocusStory(s.stories[0]);
      return {defaultBright,remaining,lift:s.photoLift||0,lamps:lamps.length,cities:s.stories.length,
        active:tags[0].material.color.r,inactive:tags[1].material.color.r,
        above:lamps.every(l=>l.group.position.y-.6>tags.find(t=>t.userData.city===l.city).position.y+.815)};
    });
    assert.ok(result.defaultBright,'全部年份时牌匾为常亮');
    assert.equal(result.lamps,result.cities,'每个城市牌匾一盏夜灯');
    assert.ok(result.active>result.inactive*2,'牌匾跟随城市选择高亮');assert.equal(result.above,true);
    assert.ok(Math.abs(result.remaining-result.lift)<.001,'整组上移量等于保留下来的半段最短空绳');
    await f.locator('#city-layout').click();
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene;s.setFocusStory(s.stories[0]);return s.cityClusters[0].label.material.color.r>s.cityClusters[1].label.material.color.r*2&&s.plaqueLanterns.every(l=>l.group.parent===s.cityClusters.find(c=>c.city===l.city).group);}),true,'分类布局保留牌匾明暗和夜灯');
    await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));await page.screenshot({path:path.join(folder,'city-plaques.png')});
    console.log('牌匾夜灯预览：'+path.join(folder,'city-plaques.png'));
  }finally{await browser.close();}
});

test('树只缩短20%竖向高度，照片尺寸、横向宽度和底座保持不变',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f}=await fixture(page,records());
    const result=await f.evaluate(()=>{const s=travelTree.scene;return {scale:s.tree.scale.toArray(),photo:s.photos.map(p=>({w:p.w,h:p.h,r:Math.hypot(p.rest.x,p.rest.z),anchor:p.anchorY,top:p.rest.y+p.h/2})),platform:s.scene.getObjectByName('travel-year-platform').scale.toArray()};});
    assert.deepEqual(result.scale,[1,.8,1],'只压缩树体Y轴');
    assert.deepEqual(result.platform,[1,1,1],'底座不缩放');
    for(const p of result.photo){assert.equal(p.w,1.6);assert.ok(Math.abs(p.h-1.6*5/3)<.001,'照片宽高不缩小');assert.ok(Math.abs(p.anchor-.8*(24.65+5*(1-Math.min(p.r/16,1)**2)))<.001,'挂点随树冠降低');assert.ok(p.top<p.anchor-1,'照片与树冠保持净空');}
    await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene;return s.cityClusters.every(c=>c.group.position.y<21&&c.cards.every(p=>p.group.position.y+c.group.position.y-p.photo.h*p.layoutScale/2>2));}),true,'分类布局同步降低且不碰底座');
  }finally{await browser.close();}
});

test('电脑端圈层交互：七张一列高度对齐、年份先旋转后高亮且坐标稳定、按圈开关和牌匾聚焦',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000}});
    const rs=Array.from({length:36},(_,i)=>Array.from({length:i===0?21:3},(_,j)=>({...records()[0],id:`zone${i}:${j}`,cityKey:`zone${i}`,title:`城市${i}`,year:i<9?2026:i<21?2025:2024}))).flat();
    const {f}=await fixture(page,rs);await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    const layout=await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);window.fixedLayout=s.cityClusters.map(c=>({p:c.group.position.toArray(),cards:c.cards.map(p=>p.hangingRest.toArray())}));return {ys:s.cityClusters.map(c=>c.group.position.y),rows:[...new Set(s.cityClusters[0].cards.map(c=>c.hangingRest.y))].length,cols:[...new Set(s.cityClusters[0].cards.map(c=>c.hangingRest.x))].length,rowY:s.cityClusters.map(c=>Math.max(...c.cards.map(p=>p.hangingRest.y)))};});
    assert.equal(layout.rows,7);assert.equal(layout.cols,3);assert.equal(new Set(layout.ys).size,1);assert.equal(new Set(layout.rowY).size,1,'不同圈照片排高必须对齐');
    assert.ok(await f.locator('[data-ring-section="0"] [data-city]').count()>0);assert.ok(await f.locator('[data-ring-section="1"] [data-city]').count()>0);
    await f.locator('[data-year="2025"]').click();
    assert.equal(await f.evaluate(()=>travelTree.scene.year),null,'旋转过程中仍显示全部照片');
    assert.equal(await f.evaluate(()=>!!travelTree.scene.flight),true);
    await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    assert.equal(await f.evaluate(()=>travelTree.scene.year),2025);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.every(c=>c.group.parent.visible&&c.dim===(c.photo.year===2025?0:1))),true,'年份高亮不隐藏城市组，仅允许遮挡照片让位');
    assert.equal(await f.evaluate(()=>travelTree.scene.cityClusters.every((c,i)=>c.group.position.toArray().every((v,j)=>v===fixedLayout[i].p[j])&&c.cards.every((p,k)=>p.hangingRest.toArray().every((v,j)=>v===fixedLayout[i].cards[k][j])))),true,'年份切换不能重新排列照片');
    await f.locator('[data-year="2026"]').click();await f.locator('[data-year="2024"]').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));assert.equal(await f.evaluate(()=>travelTree.scene.year),2024,'连续切换只应用最后一次年份');
    await f.locator('[data-year="all"]').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    await f.locator('[data-ring-toggle="0"]').click();assert.equal(await f.evaluate(()=>travelTree.scene.cityClusters.filter(c=>c.ringIndex===0).every(c=>!c.group.visible)),true);assert.equal(await f.evaluate(()=>travelTree.scene.cityClusters.some(c=>c.ringIndex===1&&c.group.visible)),true);
    await f.locator('[data-ring-toggle="0"]').click();assert.equal(await f.evaluate(()=>travelTree.scene.cityClusters.every(c=>c.group.visible)),true);
    const sign=await f.evaluate(()=>{const s=travelTree.scene,c=s.cityClusters[0];const view=s.storyView(c.city);s.camera.position.copy(view.pos);s.controls.target.copy(view.target);s.camera.lookAt(view.target);s._updateCards(1);s.scene.updateMatrixWorld(true);const v=c.label.getWorldPosition(s._clusterPoint).clone().project(s.camera),r=s.rect;return {x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2,shown:c.label.visible};});
    assert.equal(sign.shown,true);await page.mouse.click(sign.x,sign.y);assert.equal(await f.evaluate(()=>travelTree.state.city.id),'zone0');
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.photo.story.id==='zone0').every(c=>c.dim===0)),true);
    const back=await f.evaluate(()=>{const s=travelTree.scene;s.setFocusStory(null);const front=s.cityClusters[0],rear=s.cityClusters[1],v=front.label.getWorldPosition(s._clusterPoint).clone(),direction=v.clone().sub(s.camera.position).normalize();rear.group.position.copy(v.addScaledVector(direction,5));rear.label.position.set(0,0,0);s._updateCards(1);return rear.label.visible;});assert.equal(back,true,'总览不自动隐藏重叠的后排牌匾');
  }finally{await browser.close();}
});

test('电脑端内圈聚焦只隐藏前方遮挡城市，返回恢复且保留手动圈层和年份筛选',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000},reducedMotion:'reduce'});
    const rs=Array.from({length:36},(_,i)=>Array.from({length:3},(_,j)=>({...records()[0],id:`occlude${i}:${j}`,cityKey:`occlude${i}`,title:`城市${i}`,year:j===0?2025:2026}))).flat();
    const {f}=await fixture(page,rs);await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    const ids=await f.evaluate(()=>{
      const s=travelTree.scene;s.setRunning(false);
      const inner=s.cityClusters.find(c=>c.ringIndex===1),outer=s.cityClusters.filter(c=>c.ringIndex===0);
      const front=outer[0],side=outer[1],back=outer[2];
      // Controlled real geometry: camera sees an outer city immediately in front of the inner city.
      inner.group.position.set(0,24,11.6);inner.group.rotation.y=0;
      front.group.position.set(0,24,15.8);front.group.rotation.y=0;
      side.group.position.set(12,24,15.8);side.group.rotation.y=0;
      back.group.position.set(0,24,-15.8);back.group.rotation.y=0;
      s.camera.position.set(0,24,45);s.controls.target.set(0,24,11.6);s.camera.lookAt(s.controls.target);s._updateCards(1);
      window.occlusionCities={inner,front,side,back};window.occlusionRest=s.cityClusters.map(c=>c.cards.map(p=>p.hangingRest.toArray()));
      return {inner:inner.city.id,front:front.city.id,side:side.city.id};
    });
    assert.equal(await f.evaluate(()=>occlusionCities.inner.label.visible),true,'未聚焦时内圈牌匾不自动隐藏');
    await f.locator(`[data-city="${ids.inner}"]`).click();await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);s._updateCards(1);});
    assert.deepEqual(await f.evaluate(()=>{const {inner,front,side,back}=occlusionCities;return [inner.group.visible,front.group.visible,side.group.visible,back.group.visible];}),[true,false,true,true],'仅前方相交的外圈城市整组让位，旁边及后方仍显示');
    assert.equal(await f.evaluate(()=>{const {front}=occlusionCities,s=travelTree.scene,v=front.cards[0].group.getWorldPosition(s._clusterPoint).clone().project(s.camera),r=s.rect,hit=s.pick(r.left+(v.x+1)*r.width/2,r.top+(1-v.y)*r.height/2);return hit?.city===front.city||hit?.photo?.story===front.city;}),false,'隐藏城市不能继续抢占照片点击');
    assert.deepEqual(await f.evaluate(()=>{const s=travelTree.scene,{inner,front,back}=occlusionCities;s.camera.position.set(0,24,-45);s.controls.target.copy(inner.group.position);s.camera.lookAt(s.controls.target);s._updateCards(1);return [front.group.visible,back.group.visible];}),[true,false],'转到另一侧重新判断，不永久隐藏之前的前方城市');
    await f.locator(`[data-city="${ids.side}"]`).click();await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);s._updateCards(1);});
    assert.equal(await f.evaluate(()=>occlusionCities.front.group.visible),true,'切换到外圈城市恢复之前临时隐藏的城市');
    await f.locator(`[data-city="${ids.inner}"]`).click();await f.evaluate(()=>{const s=travelTree.scene;s._updateFlight(performance.now()+2000);s._updateCards(1);});
    await f.locator('#whole-view').click();assert.equal(await f.evaluate(()=>occlusionCities.front.group.visible),true,'返回整树恢复临时隐藏');
    await f.locator('[data-ring-toggle="0"]').click();await f.locator('#whole-view').click();assert.equal(await f.evaluate(()=>travelTree.scene.cityClusters.filter(c=>c.ringIndex===0).every(c=>!c.group.visible)),true,'返回不能恢复用户手动隐藏的外圈');
    await f.locator('[data-year="2025"]').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.group.parent.visible).every(c=>c.group.visible&&c.dim===(c.photo.year===2025?0:1))),true);
    assert.equal(await f.evaluate(()=>travelTree.scene.cityClusters.every((c,i)=>c.cards.every((p,j)=>p.hangingRest.toArray().every((v,k)=>v===occlusionRest[i][j][k])))),true,'聚焦与隐藏不移动照片');
  }finally{await browser.close();}
});

test('电脑端吊灯：连接照片挂线、挂环短绳完整、分类飘动跟随且不改变照片布局',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000}}),{f}=await fixture(page,records());
    const initial=await f.evaluate(()=>{const s=travelTree.scene;window.beforeLanternPhotos=s.photos.map(p=>p.rest.toArray());return {lamps:s.hangingLanterns?.length||0,floatingWire:s.scene.getObjectByName('travel-warm-lanterns').children.some(c=>c.isLine)};});
    assert.ok(initial.lamps>0&&initial.lamps<=10,'灯应少量绑定城市照片，而不是独立环形灯串');assert.equal(initial.floatingWire,false);
    const attachment=await f.evaluate(()=>{const s=travelTree.scene;return s.hangingLanterns.every(l=>{const p=l.card.photo,a=l.group.position,cord=l.group.getObjectByName('lantern-short-cord'),hook=l.group.getObjectByName('lantern-hook');return Math.abs(a.x-p.rest.x)<.001&&Math.abs(a.z-p.rest.z)<.001&&a.y>p.rest.y+p.h/2&&a.y<p.anchorY&&!!cord&&!!hook&&l.glow.scale.x<.8&&l.glow.material.opacity<.6;});});
    assert.equal(attachment,true,'普通模式中吊灯与照片同一悬线，并有短绳挂环');
    await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    const grouped=await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);s.setRotation(true,1,2);for(let i=0;i<30;i++)s._updateCards(.1);return s.hangingLanterns.every(l=>{const c=s.cityClusters.find(c=>c.city===l.city),y=l.hangingRest.y,a=c.strings.geometry.attributes.position;let nearest=Infinity;for(let i=0;i<a.count;i+=2){const y1=a.getY(i),y2=a.getY(i+1);if(y<=y1&&y>=y2){const x=a.getX(i)+(a.getX(i+1)-a.getX(i))*(y-y1)/(y2-y1);nearest=Math.min(nearest,Math.abs(l.group.position.x-x));}}return l.group.parent===c.group&&nearest<.01&&Math.abs(l.group.position.x-l.hangingRest.x)>.0001;});});
    assert.equal(grouped,true,'吊灯悬点始终在飘动挂线上');
    await f.locator('[data-year="2022"]').click();await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));assert.equal(await f.evaluate(()=>travelTree.scene.hangingLanterns.filter(l=>l.group.visible).every(l=>l.card.photo.year===2022)),true);
    await f.locator('#city-layout').click();assert.equal(await f.evaluate(()=>travelTree.scene.photos.every((p,i)=>p.rest.toArray().every((v,j)=>v===beforeLanternPhotos[i][j]))),true);
  }finally{await browser.close();}
});

test('电脑端城市面板仅显示选中城市照片，整树与分类切换清空缩略图',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f}=await fixture(page,records());
    assert.equal(await f.locator('#city-photos button').count(),0,'初始不展示所有照片');
    assert.equal(await f.locator('#city-status').textContent(),'请选择城市查看照片');
    await f.locator('[data-city="bj"]').click();assert.equal(await f.locator('#city-photos button').count(),2);assert.equal(await f.locator('#city-photos img[alt="北京"]').count(),2);
    await f.locator('[data-city="hz"]').click();assert.equal(await f.locator('#city-photos button').count(),1);assert.equal(await f.locator('#city-photos img').getAttribute('alt'),'杭州');
    await f.locator('[data-year="2022"]').click();assert.equal(await f.locator('#city-photos button').count(),0);assert.match(await f.locator('#city-status').textContent(),/请选择城市/);
    await f.locator('[data-year="all"]').click();await f.locator('[data-city="hz"]').click();await f.locator('#city-photos button').click();assert.equal(await f.locator('#photo-dialog').isVisible(),true);await f.locator('#photo-close').click();
    assert.equal(await f.locator('#whole-view').textContent(),'重置视角');
    assert.equal(await f.locator('#city-layout').textContent(),'按城市分组');
    assert.equal(await f.evaluate(()=>travelTree.state.grouped),false,'默认自然布局');
    await f.locator('#whole-view').click();assert.equal(await f.locator('#city-photos button').count(),0);
    await f.locator('#city-layout').click();assert.equal(await f.locator('#city-layout').textContent(),'返回自然布局');assert.equal(await f.locator('#city-photos button').count(),0);assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.group.visible&&c.group.parent.visible).length),3,'面板清空不隐藏树上照片');
    await f.locator('[data-city="bj"]').click();assert.equal(await f.locator('#city-photos button').count(),2);
    await f.locator('#city-layout').click();assert.equal(await f.locator('#city-layout').textContent(),'按城市分组');assert.equal(await f.locator('#city-photos button').count(),0);
  }finally{await browser.close();}
});

test('电脑端旋转控制：方向速度切换、挂线随照片漂动且停止回稳',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000}}),{f}=await fixture(page,records());
    assert.equal(await f.locator('#rotation-toggle').count(),1,'应提供自动旋转按钮');
    await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    await f.locator('#rotation-toggle').click();
    const clockwise=await f.evaluate(()=>{const s=travelTree.scene;s.setRunning(false);s._updateCards(.1);const before=s.controls.getAzimuthalAngle();s.controls.update(.1);return {delta:s.controls.getAzimuthalAngle()-before,speed:s.controls.autoRotateSpeed};});
    assert.ok(clockwise.delta<0);
    await f.locator('#rotation-direction').click();
    const counter=await f.evaluate(()=>{const s=travelTree.scene;s._updateCards(.1);const before=s.controls.getAzimuthalAngle();s.controls.update(.1);return {delta:s.controls.getAzimuthalAngle()-before,speed:s.controls.autoRotateSpeed};});
    assert.ok(counter.delta>0);assert.equal(counter.speed,-clockwise.speed);
    await f.locator('#rotation-speed').click();assert.equal(await f.locator('#rotation-speed').textContent(),'速度 2×');
    const motion=await f.evaluate(()=>{const s=travelTree.scene,c=s.cityClusters[0],p=c.cards[0];s.hangingTime=0;s.hangingAmplitude=0;for(let i=0;i<30;i++)s._updateCards(.1);const x=p.group.position.x,geometry=c.strings.geometry;for(let i=0;i<12;i++)s._updateCards(.1);return {moved:Math.abs(p.group.position.x-x),curve:geometry.attributes.position.count,geometryStable:geometry===c.strings.geometry,speed:s.controls.autoRotateSpeed};});
    assert.ok(motion.moved>.001);assert.ok(motion.curve>2);assert.equal(motion.geometryStable,true);assert.equal(motion.speed,counter.speed*2);
    await f.locator('#rotation-toggle').click();
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene;for(let i=0;i<150;i++)s._updateCards(.1);return !s.controls.autoRotate&&s.cityClusters.every(c=>c.cards.every(p=>p.group.position.distanceTo(p.hangingRest)<.001));}),true);
    await f.locator('#rotation-speed').click();await f.locator('#rotation-speed').click();assert.equal(await f.locator('#rotation-speed').textContent(),'速度 1×');
    await f.locator('#rotation-toggle').click();await f.locator('[data-city="bj"]').click();await f.locator('#city-photos button').first().click();assert.equal(await f.evaluate(()=>travelTree.scene.running&&!travelTree.scene.rotationActive),true,'右侧查看照片保留场景运行但停止自动旋转');await f.locator('#photo-close').click();assert.equal(await f.evaluate(()=>travelTree.scene.running),true);
  }finally{await browser.close();}
});

test('电脑端远景照片正反面不被背板的深度条纹覆盖',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f}=await fixture(page,records());
    const samples=await f.evaluate(()=>{
      const s=travelTree.scene,card=s.cards[0];s.setRunning(false);
      s.scene.children.forEach(child=>{child.visible=child===s.cardGroup;});
      s.cards.forEach(c=>{c.group.visible=c===card;});
      card.group.rotation.set(0,0,0);
      const gl=s.renderer.getContext(),pixels=new Uint8Array(gl.drawingBufferWidth*gl.drawingBufferHeight*4);
      const count=()=>{s.renderer.render(s.scene,s.camera);gl.readPixels(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let green=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+1]>pixels[i]*1.4&&pixels[i+1]>pixels[i+2]*1.1)green++;return green;};
      return [70,105].flatMap(distance=>[0,.65,Math.PI,Math.PI+.65].map(angle=>{
        s.camera.position.copy(card.group.position).add(s.camera.position.clone().set(Math.sin(angle)*distance,0,Math.cos(angle)*distance));s.camera.lookAt(card.group.position);
        card.plate.visible=false;const unobstructed=count();card.plate.visible=true;const backed=count();return {distance,angle,unobstructed,backed};
      }));
    });
    for(const sample of samples){assert.ok(sample.unobstructed>50,'远景测试必须实际渲染出照片像素');assert.ok(sample.backed>=sample.unobstructed*.98,JSON.stringify(sample)+'：背板不能侵占照片像素');}
  }finally{await browser.close();}
});

test('电脑端城市块：完整展示、组内不重叠且筛选不收起其他城市',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000},reducedMotion:'reduce'});
    const rs=Array.from({length:8},(_,i)=>Array.from({length:i===0?6:7},(_,j)=>({...records()[0],id:`c${i}:${j}`,cityKey:`c${i}`,title:`城市${i}`,year:j<2?2022:2026}))).flat();
    const {f}=await fixture(page,rs);
    await f.evaluate(()=>{window.originalPhotoPositions=travelTree.scene.cards.map(c=>c.group.position.toArray());});
    await f.getByRole('button',{name:'按城市分组',exact:true}).click();
    await f.waitForFunction(()=>!travelTree.scene.flight);
    const overview=await f.evaluate(()=>{const s=travelTree.scene;return {groups:s.cityClusters.filter(c=>c.group.visible).map(c=>({id:c.city.id,count:c.cards.filter(p=>p.group.visible).length,parents:c.cards.every(p=>p.group.parent===c.group),labelY:c.label.position.y,lines:c.strings.geometry.attributes.position.count/2,photos:c.cards.map(p=>({x:p.group.position.x,y:p.group.position.y,h:(p.photo.h+.27)*p.layoutScale}))})),all:s.cards.filter(c=>c.group.visible&&c.group.parent.visible).length};});
    assert.equal(overview.groups.length,8);assert.equal(overview.all,rs.length);assert.ok(overview.groups.every(g=>g.parents));
    assert.equal(overview.groups[0].lines,12);assert.equal(overview.groups[1].lines,12);
    for(const group of overview.groups){
      assert.ok(group.labelY>group.photos[0].y+group.photos[0].h/2,'先木牌再封面');
      assert.ok(new Set(group.photos.map(p=>p.y)).size<=7,'城市组每列最多七张，不无限下垂');
      for(const x of new Set(group.photos.map(p=>p.x))){const line=group.photos.filter(p=>p.x===x).sort((a,b)=>b.y-a.y);for(let i=1;i<line.length;i++)assert.ok(line[i].y+line[i].h/2<line[i-1].y-line[i-1].h/2,'同一挂线上的照片不能重叠');}
    }
    assert.equal(await f.getByRole('button',{name:'下一组城市',exact:true}).count(),0);
    await f.locator('[data-city="c0"]').click();
    assert.equal(await f.locator('[data-city="c0"]').getAttribute('aria-pressed'),'true');
    assert.equal(await f.evaluate(()=>travelTree.scene.cityClusters.filter(c=>c.group.visible).length),8);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.group.visible&&c.group.parent.visible).length),rs.length);
    await f.waitForFunction(()=>!travelTree.scene.flight);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.photo.story!==travelTree.state.city).every(c=>c.dim===1)),true,'定位城市仅弱化其他城市，不收起照片');
    const coverPoint=await f.evaluate(()=>{const s=travelTree.scene,c=s.cityClusters[0].cards[0];s._updateCards(1);s.scene.updateMatrixWorld(true);const p=c.group.getWorldPosition(s._clusterPoint).clone().project(s.camera),r=s.renderer.domElement.getBoundingClientRect();return {x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};});
    await page.mouse.click(coverPoint.x,coverPoint.y);assert.equal(await f.locator('#photo-dialog').isVisible(),true,'点击三维封面直接查看原图');await f.locator('#photo-close').click();
    await f.locator('[data-year="2022"]').click();
    await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    await f.waitForFunction(()=>!travelTree.scene.flight);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.group.visible&&c.group.parent.visible).length),rs.length);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.dim===0).length),16,'该年照片高亮，其余照片仍可见');
    await f.locator('[data-city="c0"]').click();
    await f.locator('#city-photos button').first().click();assert.equal(await f.locator('#photo-dialog').isVisible(),true);await f.locator('#photo-close').click();
    await f.locator('#whole-view').click();assert.equal(await f.evaluate(()=>travelTree.state.city),null);
    await f.getByRole('button',{name:'返回自然布局',exact:true}).click();
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.every((c,i)=>c.group.position.toArray().every((v,j)=>v===originalPhotoPositions[i][j])&&c.group.parent===travelTree.scene.cardGroup)),true);
  }finally{await browser.close();}
});

test('电脑端年轮连续填充：年份倒序、跨年城市不拆分、外圈填满后进入内圈',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1664,height:1000},reducedMotion:'reduce'});
    const rs=Array.from({length:24},(_,i)=>Array.from({length:i===0?21:8},(_,j)=>({...records()[0],id:`ring${i}:${j}`,cityKey:`ring${i}`,title:`城市${i}`,year:i<4?2026:i<12?2025:2024}))).flat();rs[0].year=2022;
    const {f}=await fixture(page,rs);await f.locator('#city-layout').click();await f.waitForFunction(()=>!travelTree.scene.flight);
    const groups=await f.evaluate(()=>travelTree.scene.cityClusters.map(c=>({id:c.city.id,r:Math.hypot(c.group.position.x,c.group.position.z),ys:[...new Set(c.cards.map(p=>p.group.position.y))],xs:[...new Set(c.cards.map(p=>p.group.position.x))],minY:Math.min(...c.cards.map(p=>p.group.position.y+c.group.position.y-p.photo.h*p.layoutScale/2)),parents:c.cards.every(p=>p.group.parent===c.group),years:c.cards.slice().sort((a,b)=>b.group.position.y-a.group.position.y||a.group.position.x-b.group.position.x).map(p=>p.photo.year),countSign:!!c.count})));
    assert.ok(new Set(groups.map(c=>Math.round(c.r*10))).size>=2,'空间不能只使用最外圈');
    assert.ok(groups.every(c=>c.ys.length<=7&&c.minY>5&&c.parents&&!c.countSign),'缩短树高后保持成组、底座净空、删除数量牌');
    assert.ok(groups[0].xs.length>=3,'21张照片按七张一列扩展横向列数');
    assert.equal(groups[0].years.at(-1),2022,'跨年城市保留在一组，旧年份排在组内后面');
    const outer=groups.filter(c=>Math.abs(c.r-15.8)<.01);
    assert.ok(outer.some(c=>c.id==='ring0')&&outer.some(c=>c.id==='ring4')&&outer.some(c=>c.id==='ring12'),'外圈可连续容纳2026、2025、2024，不是一年一圈');
    assert.ok(outer.reduce((sum,c)=>sum+(c.xs.length*2.5+.8)/15.8,0)>Math.PI*2*.85,'外圈应尽量填满再进入内圈');
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.filter(c=>c.group.visible&&c.group.parent.visible).length),rs.length);
  }finally{await browser.close();}
});

test('电脑端树根入土：主干穿入地面，树根末端埋在底座内不露出截口',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f}=await fixture(page,records());
    const m=await f.evaluate(()=>{
      const s=travelTree.scene,trunk=s.tree.getObjectByName('tree-main-trunk').geometry.attributes.position,roots=s.tree.getObjectByName('tree-base-roots').geometry.attributes.position,tier=s.scene.getObjectByName('travel-year-platform').children[4];
      const bottom=Array.from({length:21},(_,i)=>trunk.getY(i)),tips=Array.from({length:12},(_,i)=>Array.from({length:11},(_,j)=>roots.getY(i*231+j)));
      return {trunkBottomMax:Math.max(...bottom),trunkTop:trunk.getY(64*21),aboveGround:[16,32,48].map(i=>[trunk.getX(i*21),trunk.getY(i*21),trunk.getZ(i*21)]),tipMax:Math.max(...tips.flat()),platformTop:tier.position.y+tier.geometry.parameters.height/2,platformRadius:tier.geometry.parameters.radiusTop,tipRadius:Math.max(...Array.from({length:12},(_,i)=>Array.from({length:11},(_,j)=>Math.hypot(roots.getX(i*231+j),roots.getZ(i*231+j)))).flat())};
    });
    assert.ok(m.trunkBottomMax<-.1,'主干底端整个截面应伸到地面以下，不能悬停在底座顶面');
    assert.ok(m.tipMax<m.platformTop-.1,'所有树根外端截面必须被底座遮住，而不是浮在表面');
    assert.ok(m.tipRadius<m.platformRadius,'树根端点仍在中央底座范围内');assert.ok(Math.abs(m.trunkTop-29.65)<.03,'只延伸根部，不改变树冠连接高度');
    const oldBody=[[-.1240479098,8.4703302556,1.3561755937],[.1581662030,15.5350568511,.9160527454],[-.0506278191,22.5925437183,.6106173866]];
    for(const [i,point] of oldBody.entries()) for(const [axis,value] of point.entries()) assert.ok(Math.abs(m.aboveGround[i][axis]-value)<.00001,'根部入土不能重新分配地上主干的采样和粗细');
  }finally{await browser.close();}
});

test('电脑端树冠外展与花园扩展：外缘仍有花叶、底座净空和照片悬点保持稳定',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f}=await fixture(page,records());
    const m=await f.evaluate(()=>{
      const s=travelTree.scene,leaves=s.tree.getObjectByName('tree-leaf-crown'),ribs=s.tree.getObjectByName('tree-canopy-ribs'),garden=s.garden.meadow,flowers=garden.wildflowers.flowers;
      const radii=mesh=>Array.from({length:mesh.count},(_,i)=>Math.hypot(mesh.instanceMatrix.array[i*16+12],mesh.instanceMatrix.array[i*16+14]));
      const leafR=radii(leaves),flowerR=radii(flowers),scales=Array.from({length:flowers.count},(_,i)=>{const a=flowers.instanceMatrix.array,o=i*16;return Math.hypot(a[o+4],a[o+5],a[o+6]);});
      ribs.geometry.computeBoundingBox();leaves.computeBoundingBox();
      return {leafRadius:Math.max(...leafR),leafOuter:leafR.filter(r=>r>16).length,ribWidth:ribs.geometry.boundingBox.max.x-ribs.geometry.boundingBox.min.x,ribDepth:ribs.geometry.boundingBox.max.z-ribs.geometry.boundingBox.min.z,ribHeight:ribs.geometry.boundingBox.max.y-ribs.geometry.boundingBox.min.y,groundRadius:garden.surface.geometry.parameters.radius,flowerMin:Math.min(...flowerR),flowerMax:Math.max(...flowerR),flowerInner:flowerR.filter(r=>r<13.5).length,flowerOuter:flowerR.filter(r=>r>13.5).length,flowerCount:flowers.count,varieties:[...new Set(flowers.geometry.attributes.aVariant.array)].length,heightMin:Math.min(...scales),heightMax:Math.max(...scales),instanced:leaves.isInstancedMesh&&flowers.isInstancedMesh,leafClearance:leaves.boundingBox.min.y-Math.max(...s.photos.map(p=>p.rest.y+p.h/2)),anchor:s.photos[0].anchorY,framed:s._wholePoints().every(p=>{const v=p.clone().project(s.camera);return Math.abs(v.y)<.95&&Math.abs(v.x)<.95;}),threadY:s.scene.getObjectByName('travel-photo-threads').geometry.attributes.position.getY(0)};
    });
    assert.ok(m.leafRadius>18.8&&m.leafRadius<19.1,'树叶向外舒展约15%，仍限制在紧凑伞状范围内');
    assert.ok(m.leafOuter>4000,'外展区域必须有足够叶片，不只扩大空的冠层边界');
    assert.ok(m.ribWidth>36.5&&m.ribWidth<37.5&&m.ribDepth>36.5&&m.ribDepth<37.5,'顶部支撑枝条随冠层展开');assert.ok(m.ribHeight<7,'仍是宽平的伞形冠层');
    assert.ok(Math.abs(m.groundRadius-16.8)<.001,'花园半径扩大20%');
    assert.ok(m.flowerMin>7.45&&m.flowerMax>15.8&&m.flowerMax<16.2,'花草延伸到新增外缘，但不能进入中央底座');
    assert.ok(m.flowerInner>2000&&m.flowerOuter>800,'内圈不明显变稀，新增区域不能是空草地');
    assert.equal(m.flowerCount,4000);assert.equal(m.varieties,6);assert.ok(m.heightMin<.55&&m.heightMax>.85,'保留多品种、高低错落的花簇');assert.equal(m.instanced,true);
    assert.ok(m.leafClearance>1);assert.ok(Math.abs(m.anchor-28.4919921875)<.001,'此次扩展不移动照片悬点');assert.ok(Math.abs(m.threadY-m.anchor)<.001);assert.equal(m.framed,true,'扩大后花園和树冠必须完整入镜');
  }finally{await browser.close();}
});

test('电脑端树体量：截面加粗加高、冠层加密且不缩放照片和底座',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),{f}=await fixture(page,records());
    const m=await f.evaluate(()=>{
      const s=travelTree.scene,t=s.tree,trunk=t.getObjectByName('tree-main-trunk'),leaf=t.getObjectByName('tree-leaf-crown'),p=trunk.geometry.attributes.position,uv=trunk.geometry.attributes.uv;
      const ring=i=>{const a=i*21,b=a+10;return {center:[(p.getX(a)+p.getX(b))/2,(p.getY(a)+p.getY(b))/2,(p.getZ(a)+p.getZ(b))/2],radius:Math.hypot(p.getX(a)-p.getX(b),p.getY(a)-p.getY(b),p.getZ(a)-p.getZ(b))/2,uvLength:uv.getX(a),uvCircumference:uv.getY(a+20)-uv.getY(a)};};
      const samples=[0,4000,8000,12000,15999].map(i=>{const a=leaf.instanceMatrix.array,o=i*16;return {xz:[a[o+12],a[o+14]],scale:Math.hypot(a[o],a[o+1],a[o+2])};});
      const lines=s.scene.getObjectByName('travel-photo-threads').geometry.attributes.position;
      const rootUV=t.getObjectByName('tree-base-roots').geometry.attributes.uv,ribUV=t.getObjectByName('tree-canopy-ribs').geometry.attributes.uv;
      return {rings:[0,32,64].map(ring),rootUV:[rootUV.getX(220),rootUV.getY(10)],ribUV:[ribUV.getX(220),ribUV.getY(10),ribUV.getY(230)],leafCount:leaf.count,samples,groupScale:t.scale.toArray(),stemScale:trunk.scale.toArray(),wood:{roughness:trunk.material.roughness,metalness:trunk.material.metalness,bump:trunk.material.bumpScale,separateBump:trunk.material.map!==trunk.material.bumpMap},frames:s.cards.map(c=>[c.group.position.toArray(),c.photo.w,c.photo.h]),anchors:s.photos.map(p=>p.anchorY),threads:s.photos.map((p,i)=>[lines.getY(i*2),lines.getY(i*2+1),p.rest.y+p.h/2]),meshes:t.children.length};
    });
    assert.ok(Math.abs(m.rings[2].center[1]-m.rings[0].center[1]-29.9)<.001,'主干从地下延伸到原树冠高度，不能只拉伸整个模型');
    for(const [i,want] of [1.755,.911625,.624].entries()) assert.ok(Math.abs(m.rings[i].radius-want)<.001,'保留 taper，底部/中段/顶部截面分别加粗');
    assert.deepEqual(m.groupScale,[1,1,1]);assert.deepEqual(m.stemScale,[1,1,1]);
    for(const [i,want] of [0,.625,1.25].entries()) assert.ok(Math.abs(m.rings[i].uvLength-want)<.001,'TubeGeometry 的 U 沿管长，木纹纵向补偿25%');
    for(const [i,want] of [1.35,1.275,1.2].entries()) assert.ok(Math.abs(m.rings[i].uvCircumference-want)<.001,'TubeGeometry 的 V 沿截面周长，木纹重复率跟随加粗比例');
    for(const [i,want] of [1,1.25].entries()) assert.ok(Math.abs(m.rootUV[i]-want)<.001,'树根只加粗，不改变沿管长的纹理密度');
    for(const [i,want] of [1,1.495,1.15].entries()) assert.ok(Math.abs(m.ribUV[i]-want)<.001,'主枝接头及末端的周向木纹补偿应跟随局部截面');
    assert.equal(m.leafCount,32000);assert.equal(m.meshes,4,'树体升级不能增加独立叶片绘制对象');
    const xz=[[-4.323549270629883,12.150930404663086],[1.8680989742279053,-1.666804313659668],[-7.5049285888671875,4.8863325119018555],[-.07101690024137497,-9.081318855285645],[10.997933387756348,-11.781288146972656]];
    for(const [i,point] of xz.entries()) for(const [axis,value] of point.entries()) assert.ok(Math.abs(m.samples[i].xz[axis]-value*1.15)<.00001,'原有叶片仅径向外展15%，不重新随机生成另一种树形');
    for(const [i,oldScale] of [.6075713938,.7353925311,.5943108824,.6849109838,.6274117518].entries()) assert.ok(Math.abs(m.samples[i].scale/oldScale-1.2)<.015,'叶片尺寸增加约20%');
    assert.ok(m.wood.roughness>=.93);assert.equal(m.wood.metalness,0);assert.ok(m.wood.bump>=.16);assert.equal(m.wood.separateBump,true,'树皮凹凸使用独立高度图，不直接把暖色贴图当高度');
    assert.equal(m.frames.length,3);assert.ok(m.frames.every(f=>Math.abs(f[1]-1.6)<.001&&Math.abs(f[2]-8/3)<.001),'照片尺寸不随树体变大');
    assert.ok(Math.abs(m.anchors[0]-28.4919921875)<.001,'树冠与悬挂锚点共同上移5.65，照片位置不动');
    for(const [i,line] of m.threads.entries()){assert.ok(Math.abs(line[0]-m.anchors[i])<.001);assert.ok(Math.abs(line[1]-line[2])<.001,'吊线下端仍然连着原照片顶部');}
  }finally{await browser.close();}
});

test('电脑端树形伞幕：枝叶位于照片上方，单主干支撑通透悬挂区',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const rs=Array.from({length:161},(_,i)=>({...records()[0],id:'city'+i%27+':'+i,cityKey:'city'+i%27,title:'城市'+i%27,year:2022+i%5,aspect:i%2?4/3:3/4}));
    const {f}=await fixture(page,rs);
    const metrics=await f.evaluate(()=>{
      const s=travelTree.scene,t=s.tree,trunk=t.getObjectByName('tree-main-trunk'),ribs=t.getObjectByName('tree-canopy-ribs'),leaves=t.getObjectByName('tree-leaf-crown');
      const bounds=object=>{if(!object)return null;object.geometry.computeBoundingBox();return {min:object.geometry.boundingBox.min.toArray(),max:object.geometry.boundingBox.max.toArray()};};
      leaves.computeBoundingBox();const leafMin=leaves.boundingBox.min.y;
      return {trunk:bounds(trunk),ribs:bounds(ribs),leafMin,photoTop:Math.max(...s.photos.map(p=>p.rest.y+p.h/2)),anchors:s.photos.every(p=>p.anchorY>p.rest.y+p.h/2+1&&p.anchorY>=18),crown:bounds(ribs),count:s.cards.length};
    });
    assert.ok(metrics.leafMin>metrics.photoTop+1,'叶子必须集中在顶部，不能进入照片区域遮挡相片');
    assert.ok(metrics.trunk,'只有中心主干贯穿照片悬挂区');assert.ok(metrics.ribs,'顶部需要伞骨状支撑枝条');
    assert.ok(metrics.ribs.min[1]>metrics.photoTop+1,'伞状枝条不得伸进下方照片区域');
    assert.ok(metrics.crown.max[0]-metrics.crown.min[0]>=30,'树冠横向展开，不能是窄小直立树');
    assert.ok(metrics.crown.max[1]-metrics.crown.min[1]<7,'树冠应是伞形而非密集纵向分叉');
    assert.equal(metrics.anchors,true,'所有照片悬线必须从顶部树冠落下');assert.equal(metrics.count,161);
  }finally{await browser.close();}
});

for(const width of [1440,390]) test((width===1440?'电脑端':'手机端')+'树冠叶面完整、透明轮廓与离线渲染',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      const requests=[];page.on('request',r=>requests.push(r.url()));
      const {f}=await fixture(page,records());
      const metrics=await f.evaluate(()=>{const s=travelTree.scene,t=s.tree,leaf=t.getObjectByName('tree-leaf-crown'),g=leaf.geometry;return {leafCount:leaf.count,lastIndex:Math.max(...g.index.array),vertices:g.attributes.position.count,alpha:!!leaf.material.map,shaders:s.renderer.info.programs.every(p=>s.renderer.getContext().getProgramParameter(p.program,s.renderer.getContext().LINK_STATUS)),height:t.getObjectByName('tree-main-trunk').geometry.boundingBox.max.y};});
      assert.ok(metrics.leafCount>=(width===390?5000:12000),'顶部树冠需有足够密集的叶面');
      assert.equal(metrics.lastIndex,metrics.vertices-1,'叶片几何索引完整');
      assert.equal(metrics.alpha,true,'叶面需有透明轮廓，不能出现矩形绿片');
      assert.equal(metrics.shaders,true);assert.ok(metrics.height>=23);assert.equal(requests.filter(url=>/^https?:/.test(url)).length,0);
      if(width===1440) assert.equal(await f.evaluate(()=>{const s=travelTree.scene;return s._wholePoints().every(p=>Math.abs(p.clone().project(s.camera).y)<.95);}),true,'看整棵树不能被旧相机距离上限裁掉树冠和底座');
      await page.close();
  }finally{await browser.close();}
});
test('电脑端独立年轮树：年份/城市/原图状态、旋转缩放与暂停',async()=>{
  assert.ok(fs.existsSync(embedded),'年轮树场景尚未构建');
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[],requests=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    const {f,folder}=await fixture(page,records());
    const initial=await f.evaluate(()=>{const s=travelTree.scene;window.originalCards=s.cards.map(c=>c.group);return {count:s.cards.length,tree:!!s.scene.getObjectByName('travel-memory-tree'),flowers:s.garden.meadow.wildflowerCount,aspect:s.photos[0].h/s.photos[0].w,shaders:s.renderer.info.programs.every(p=>s.renderer.getContext().getProgramParameter(p.program,s.renderer.getContext().LINK_STATUS))};});
    assert.equal(initial.tree,true);assert.equal(initial.count,3);assert.ok(Math.abs(initial.aspect-5/3)<.001);assert.equal(initial.flowers,4000);assert.equal(initial.shaders,true);
    await f.locator('[data-year="2022"]').click();
    await f.evaluate(()=>travelTree.scene._updateFlight(performance.now()+2000));
    assert.deepEqual(await f.evaluate(()=>travelTree.scene.cards.map(c=>c.dim)),[0,1,1]);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.every((c,i)=>c.group===originalCards[i])),true);
    await f.locator('[data-year="all"]').click();await f.locator('[data-city="hz"]').click();assert.equal(await f.evaluate(()=>travelTree.state.year),null);assert.equal(await f.locator('#city-photos button').count(),1,'点击城市后恢复全部年份照片');
    await f.locator('#city-photos button').first().click();assert.equal(await f.locator('#photo-dialog').isVisible(),true);assert.equal(await f.locator('#original-photo').getAttribute('src'),records()[2].src);
    await f.locator('#photo-close').click();assert.equal(await f.evaluate(()=>travelTree.state.city.id),'hz');
    const before=await f.evaluate(()=>travelTree.scene.camera.position.toArray());
    const canvas=f.locator('#scene'),box=await canvas.boundingBox();
    await page.mouse.move(box.x+box.width*.7,box.y+box.height*.45);await page.mouse.down();await page.mouse.move(box.x+box.width*.8,box.y+box.height*.5,{steps:8});await page.mouse.up();
    await page.waitForTimeout(150);assert.notDeepEqual(await f.evaluate(()=>travelTree.scene.camera.position.toArray()),before);
    await canvas.hover({position:{x:800,y:350}});const distance=await f.evaluate(()=>travelTree.scene.camera.position.distanceTo(travelTree.scene.controls.target));await page.mouse.wheel(0,180);await page.waitForTimeout(150);assert.notEqual(await f.evaluate(()=>travelTree.scene.camera.position.distanceTo(travelTree.scene.controls.target)),distance);
    await f.locator('#whole-view').click();await page.waitForTimeout(100);
    await page.screenshot({path:path.join(folder,'tree-desktop.png')});console.log('年轮树截图：'+path.join(folder,'tree-desktop.png'));
    assert.equal(requests.filter(r=>/^https?:/.test(r)).length,0);assert.deepEqual(errors,[]);
    await f.evaluate(()=>travelTree.scene.setRunning(false));const time=await f.evaluate(()=>travelTree.scene.time);await page.waitForTimeout(100);assert.equal(await f.evaluate(()=>travelTree.scene.time),time);
    await page.emulateMedia({reducedMotion:'no-preference'});
    const {f:animated}=await fixture(page,records());
    assert.equal(await animated.evaluate(()=>travelTree.scene.garden.meadow.wildflowerCount),4000);
    await animated.evaluate(()=>travelTree.scene.setRunning(false));const t=await animated.evaluate(()=>travelTree.scene.time);await page.waitForTimeout(100);assert.equal(await animated.evaluate(()=>travelTree.scene.time),t);await animated.evaluate(()=>travelTree.scene.setRunning(true));await animated.waitForFunction(t=>travelTree.scene.time>t,t);
  }finally{await browser.close();}
});
test('手机端年轮树布局与暂停',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}}),{f,folder}=await fixture(page,records());
    assert.equal(await f.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:path.join(folder,'tree-mobile.png')});
    assert.equal(await f.evaluate(()=>travelTree.scene.garden.meadow.wildflowerCount),800);
    await f.evaluate(()=>travelTree.scene.setRunning(false));const time=await f.evaluate(()=>travelTree.scene.time);await page.waitForTimeout(100);assert.equal(await f.evaluate(()=>travelTree.scene.time),time);
    await f.evaluate(()=>travelTree.scene.setRunning(true));await f.waitForFunction(t=>travelTree.scene.time>t,time);
  }finally{await browser.close();}
});
for(const width of [1280,390]) test((width===1280?'电脑端':'手机端')+'无WebGL、坏图片、未知年份与空相册仍能查看和返回',async()=>{
  assert.ok(fs.existsSync(embedded),'年轮树场景尚未构建');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{const page=await browser.newPage({viewport:{width,height:844}});await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /^webgl/.test(type)?null:get.call(this,type,...args);};});
    const rs=records();rs[0].year='年份未确定';rs[0].src=rs[0].full='data:image/jpeg,broken';
    const {f}=await fixture(page,rs);assert.equal(await f.locator('#fallback').isVisible(),true);await f.locator('[data-city="hz"]').click();await f.locator('#city-photos button').click();assert.equal(await f.locator('#photo-dialog').isVisible(),true);await f.locator('#photo-close').click();assert.equal(await f.locator('[data-year="unknown"]').isVisible(),true);
    const empty=await fixture(page,[]);assert.match(await empty.f.locator('#loading').textContent(),/还没有城市照片/);assert.deepEqual(await empty.f.evaluate(()=>travelTree.catalog.years),[]);
  }finally{await browser.close();}
});

test('功能菜单独立入口、手动年份与异步关闭重开隔离',async()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(html,/id="travelRingTreeBtn"/,'功能菜单尚未接入旅行年轮树');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage();
    await page.setContent(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''));
    await page.addScriptTag({path:embedded});
    await page.addScriptTag({path:path.join(root,'assets/travel-ring-tree/host.js')});
    const start=html.indexOf('window.initTravelRingTree('),end=html.indexOf('const lifeAtlasEffect=',start);
    assert.ok(start>0&&end>start);
    await page.addScriptTag({path:path.join(root,'assets/image-atlas/data.js')});
    await page.evaluate(rs=>{
      window.$=id=>document.getElementById(id);
      window.collectJourneyArchiveData=async()=>({entries:[{city:{cityKey:'bj',name:'北京'},month:'2026-06'}]});
      window.idbGetSetting=async()=>({'bj:photo':2022});
      window.getPhotosByCity=async()=>{await new Promise(resolve=>window.resolvePhotos=resolve);return [{id:'photo',dataUrl:rs[0].src,width:300,height:500}];};
      document.querySelector('#headerMenuPanel').hidden=false;
      document.querySelector('#launch-screen').remove();
    },records());
    await page.addScriptTag({content:html.slice(start,end)});
    await page.locator('#travelRingTreeBtn').click();
    assert.equal(await page.locator('#travelRingTreeOverlay').isVisible(),true);
    await page.waitForFunction(()=>window.resolvePhotos);
    await page.evaluate(()=>window.oldPhotos=resolvePhotos);
    await page.locator('#travelRingTreeClose').click();
    await page.waitForTimeout(100);assert.equal(await page.locator('#travelRingTreeHost iframe').count(),0);
    assert.equal(await page.locator('#travelRingTreeBtn').evaluate(el=>el===document.activeElement),true);
    await page.evaluate(()=>window.resolvePhotos=null);
    await page.locator('#travelRingTreeBtn').click();await page.waitForFunction(()=>window.resolvePhotos);await page.evaluate(()=>resolvePhotos());
    const f=await (await page.locator('#travelRingTreeHost iframe').elementHandle()).contentFrame();
    await f.waitForFunction(()=>window.travelTree);await f.evaluate(()=>travelTree.ready);
    assert.equal(await f.evaluate(()=>travelTree.catalog.photos[0].year),2022);
    await page.locator('#travelRingTreeClose').focus();await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(()=>document.querySelector('#travelRingTreeOverlay').contains(document.activeElement)),true,'键盘焦点不能回到弹层背后的地图');
    await f.locator('#city-toggle').click();await f.locator('#city-nav button').first().click();
    await f.locator('#city-photos button').click();
    await page.waitForFunction(()=>document.querySelector('#travelRingTreeClose').hidden,{},{timeout:2000});
    assert.equal(await page.locator('#travelRingTreeClose').isVisible(),false,'照片面板打开时返回地图不能遮挡关闭按钮');
    await f.locator('#photo-close').click({timeout:1000});
    await page.waitForFunction(()=>!document.querySelector('#travelRingTreeClose').hidden);
    assert.equal(await page.locator('#travelRingTreeClose').isVisible(),true,'关闭照片面板后恢复返回地图');
    await f.locator('#city-photos button').click();
    await page.waitForFunction(()=>document.querySelector('#travelRingTreeClose').hidden);
    await page.evaluate(()=>window.postMessage({type:'tree:photo-panel',open:false},'*'));
    await page.waitForTimeout(50);
    assert.equal(await page.locator('#travelRingTreeClose').isVisible(),false,'忽略非当前树场景的面板消息');
    await f.locator('#photo-close').focus();await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('#travelRingTreeClose').hidden);
    assert.equal(await f.locator('#photo-dialog').isVisible(),false,'Escape 仅关闭照片并恢复返回地图');
    assert.equal(await page.locator('#travelRingTreeOverlay').isVisible(),true,'返回树下不能误点外层返回地图');
    await page.evaluate(()=>{window.mountedFrame=document.querySelector('#travelRingTreeHost iframe');oldPhotos();});await page.waitForTimeout(100);
    assert.equal(await page.evaluate(()=>mountedFrame===document.querySelector('#travelRingTreeHost iframe')),true,'旧读取完成不替换新场景');
    await page.evaluate(()=>window.postMessage({type:'tree:close'},'*'));await page.waitForTimeout(50);
    assert.equal(await page.locator('#travelRingTreeOverlay').isVisible(),true,'忽略其他窗口的关闭消息');
    await f.locator('[data-year="2022"]').focus();await page.keyboard.press('Escape');
    await page.waitForFunction(()=>document.querySelector('#travelRingTreeOverlay').hidden);
    assert.equal(await page.locator('#travelRingTreeHost iframe').count(),0);
  }finally{await browser.close();}
});

test('27 城市 161 张照片的布局边界与独立场景切换',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const images=['#458c73','#b1bc86','#a58969'].map(color=>'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="500"><rect width="300" height="500" fill="'+color+'"/></svg>'));
    const rs=Array.from({length:161},(_,i)=>({...records()[0],id:'city'+i%27+':'+i,cityKey:'city'+i%27,title:'城市'+i%27,year:2022+i%5,src:images[i%images.length],full:images[i%images.length],aspect:i===0?.1:i%2?4/3:3/4}));
    const {f,folder}=await fixture(page,rs);
    assert.equal(await f.evaluate(()=>travelTree.catalog.cities.length),27);
    assert.equal(await f.evaluate(()=>travelTree.scene.cards.length),161);
    assert.equal(await f.evaluate(()=>travelTree.scene.photos.every(p=>Math.hypot(p.rest.x,p.rest.z)<=13&&p.h<=3.2)),true);
    const design=await f.evaluate(()=>{const s=travelTree.scene,tree=s.scene.getObjectByName('travel-memory-tree');const trunk=tree.getObjectByName('tree-main-trunk').geometry;trunk.computeBoundingBox();return {height:trunk.boundingBox.max.y,spread:Math.max(...s.photos.map(p=>p.rest.y))-Math.min(...s.photos.map(p=>p.rest.y)),leaves:s.scene.getObjectByName('tree-leaf-crown')?.count||0,tiers:s.scene.getObjectByName('travel-year-platform')?.children.length||0,tags:s.scene.getObjectByName('travel-city-wood-tags')?.children.length||0,lights:!!s.scene.getObjectByName('travel-warm-lanterns'),framed:s.cards.every(c=>c.plate.geometry.parameters.width>c.photo.w+.12)};});
    assert.ok(design.height>=23,'高主干支撑顶部伞状树冠');assert.ok(design.spread>=5,'照片应高低分层，而不是堆在同一高度');assert.ok(design.leaves>=1800,'树冠叶片形成饱满的枝叶簇');assert.ok(design.tiers>=3,'年轮底座有阶梯层次');assert.equal(design.tags,27,'真实城市木牌');assert.equal(design.lights,true);assert.equal(design.framed,true);
    assert.equal(await f.evaluate(()=>{const s=travelTree.scene,tiers=s.scene.getObjectByName('travel-year-platform').children.filter(m=>m.geometry.type==='CylinderGeometry');return s.scene.children.filter(m=>m.geometry?.type==='PlaneGeometry').every(label=>{const g=label.geometry.parameters;return [-1,1].every(x=>[-1,1].every(z=>{const r=Math.hypot(label.position.x+x*g.width/2,label.position.z+z*g.height/2);return tiers.every(tier=>r>tier.geometry.parameters.radiusTop||label.position.y>tier.position.y+tier.geometry.parameters.height/2);}));});}),true,'年份文字不能被较高的圆台遮挡');
    await page.screenshot({path:path.join(folder,'tree-many-photos.png')});console.log('多照片截图：'+path.join(folder,'tree-many-photos.png'));
    await page.addScriptTag({path:path.join(root,'assets/travel-ring-tree/host.js')});
    await page.addScriptTag({path:path.join(root,'assets/umbrella-canopy/host.js')});
    await page.addScriptTag({path:path.join(root,'assets/umbrella-canopy/embedded.js')});
    await page.evaluate(rs=>{
      document.querySelector('#stage').remove();
      document.body.insertAdjacentHTML('beforeend','<button id="headerMenuToggle"></button><div id="headerMenuPanel"><button id="treeBtn">树</button><button id="lifeCanopyBtn">伞</button></div><div id="treeOverlay" hidden><button id="treeClose">关闭树</button><div id="treeHost"></div></div><div id="canopyOverlay" hidden><button id="canopyClose">关闭伞</button><div id="canopyHost"></div></div>');
      const el=id=>document.getElementById(id);
      initTravelCanopy({button:el('lifeCanopyBtn'),overlay:el('canopyOverlay'),host:el('canopyHost'),close:el('canopyClose'),collectRecords:async()=>rs});
      initTravelRingTree({button:el('treeBtn'),overlay:el('treeOverlay'),host:el('treeHost'),close:el('treeClose'),collectRecords:async()=>rs});
    },records());
    await page.locator('#lifeCanopyBtn').click();await page.waitForFunction(()=>document.querySelector('#canopyHost iframe'));
    await page.locator('#treeBtn').click();await page.waitForFunction(()=>document.querySelector('#treeHost iframe'));
    assert.equal(await page.locator('#canopyHost iframe').count(),0);
    await page.evaluate(()=>document.querySelector('#lifeCanopyBtn').click());await page.waitForFunction(()=>document.querySelector('#canopyHost iframe'));
    assert.equal(await page.locator('#treeHost iframe').count(),0);
    await page.locator('#canopyClose').click();assert.equal(await page.locator('iframe').count(),0);
  }finally{await browser.close();}
});
