const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
test('左下角城市缩略图上下滚动，滚动条融入深色背景且手机不溢出',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    const template=fs.readFileSync(path.join(root,'assets/umbrella-canopy/template.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');
    await page.setContent(template);
    await page.addStyleTag({path:path.join(root,'assets/umbrella-canopy/style.css')});
    const main=fs.readFileSync(path.join(root,'index.html'),'utf8');
    await page.addStyleTag({content:main.match(/<style id="canopy-controls-theme">([\s\S]*?)<\/style>/)[1]});
    await page.evaluate(html=>document.body.insertAdjacentHTML('beforeend',html),main.match(/<button id="canopyClose"[^>]*>[\s\S]*?<\/button>/)[0]);
    for(const selector of ['#btn-index','#btn-whole','.chips','#canopyClose']){
      const theme=await page.locator(selector).evaluate(el=>({color:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
      assert.equal(theme.color,'rgb(52, 75, 59)','主场景按钮与城市栏使用深松绿文字');
      assert.ok(Number(theme.bg.match(/[\d.]+/g)[0])>220,'主场景操作采用浅色底板');
    }
    await page.evaluate(()=>{
      document.querySelector('#loader').remove();
      document.querySelector('#story-card').hidden=false;
      document.querySelector('#story-title').textContent='北京市';
      for(let i=0;i<24;i++){
        const thumb=document.createElement('button');thumb.className='thumb';thumb.textContent=i+1;
        document.querySelector('#story-strip').appendChild(thumb);
      }
    });
    const strip=page.locator('#story-strip');
    for(const width of [1280,390]){
      await page.setViewportSize({width,height:844});
      if(width===390){
        const actions=await page.locator('.top-actions').boundingBox(),back=await page.locator('#canopyClose').boundingBox();
        assert.ok(actions.y>=back.y+back.height,'手机旋转按钮不遮挡返回按钮');
      }
      const geometry=await strip.evaluate(el=>({vertical:el.scrollHeight>el.clientHeight,horizontal:el.scrollWidth>el.clientWidth,bar:getComputedStyle(el).scrollbarColor,children:[...el.children].map(c=>c.getBoundingClientRect().top)}));
      assert.equal(geometry.vertical,true,'较多城市照片在有限高度内纵向滚动');
      assert.equal(geometry.horizontal,false,'不再横向滚动');
      assert.ok(geometry.children[5]>geometry.children[0],'缩略图换到下一行');
      assert.match(geometry.bar,/transparent|rgba\(0, 0, 0, 0\)/,'滚动轨道透明，没有白色条框');
      await strip.hover();await page.mouse.wheel(0,160);
      await page.waitForFunction(()=>document.querySelector('#story-strip').scrollTop>0);
      assert.equal(await strip.evaluate(el=>el.scrollLeft),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await strip.evaluate(el=>{el.scrollTop=0;});
    }
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'canopy-city-scroll.png')});
  }finally{await browser.close();}
});
test('城市照片在本地内嵌原版3D伞幕中完整呈现、按城市浏览、看原图、返回释放',async()=>{
  if(!fs.existsSync(path.join(root,'assets/umbrella-canopy/embedded.js')))assert.fail('需要双击兼容伞幕');
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[],requests=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    const folder=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'travel-canopy-file-'));
    const file=path.join(folder,'index.html');
    fs.writeFileSync(file,'<meta charset="utf-8"><button id="open">伞幕照片</button><div id="overlay" hidden><button id="close">返回时间轴</button><div id="host" style="height:800px"></div></div>');
    await page.goto(require('node:url').pathToFileURL(file).href);
    await page.addScriptTag({path:path.join(root,'assets/umbrella-canopy/embedded.js')});
    await page.addScriptTag({path:path.join(root,'assets/umbrella-canopy/host.js')});
    await page.evaluate(()=>{
      const src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="500"><rect width="300" height="500" fill="#60a58d"/></svg>');
      const records=['杭州','杭州','北京'].map((title,i)=>({id:String(i),title,tags:title,src,full:src,aspect:3/5,year:2026,date:'2026',dateSource:'city',visitYears:[2026]}));
      window.fixtureRecords=records;
      window.initTravelCanopy({button:document.querySelector('#open'),overlay:document.querySelector('#overlay'),host:document.querySelector('#host'),close:document.querySelector('#close'),collectRecords:async()=>window.fixtureRecords});
    });
    await page.locator('#open').click();
    const f=()=>page.frames().find(f=>f!==page.mainFrame());
    await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow.canopy?.scene?.cards?.every(c=>c.loaded),{},{timeout:60000});
    await f().evaluate(()=>window.canopy.ready);
    assert.equal(f().url(),'about:srcdoc');
    const state=await f().evaluate(()=>({photos:canopy.state.photos.length,cards:canopy.scene.cards.length,cities:canopy.state.stories.length,aspect:canopy.state.photos[0].aspect,objects:canopy.scene.scene.children.length}));
    assert.equal(state.photos,3);assert.equal(state.cards,3);assert.equal(state.cities,2);assert.ok(Math.abs(state.aspect-5/3)<.001,'竖图保留实际宽高比例');assert.ok(state.objects>10,'真实原版场景，不是照片列表替代品');
    const garden=await f().evaluate(()=>{
      const s=canopy.scene,g=s.garden;
      if(!g)return null;
      const gl=s.renderer.getContext();
      const maxRadius=mesh=>{const a=mesh.instanceMatrix.array;let max=0;for(let i=0;i<mesh.count;i++)max=Math.max(max,Math.hypot(a[i*16+12],a[i*16+14]));return max;};
      const ground=g.meadow.surface.geometry;ground.computeBoundingSphere();
      const a=g.meadow.wildflowers.flowers.instanceMatrix.array;
      let innerFlowers=0;for(let i=0;i<g.meadow.wildflowerCount;i++)if(Math.hypot(a[i*16+12],a[i*16+14])<8)innerFlowers++;
      const flowers=g.meadow.wildflowers.flowers;
      const heights=[];for(let i=0;i<flowers.count;i++)heights.push(Math.hypot(a[i*16+4],a[i*16+5],a[i*16+6]));
      return {blades:g.meadow.bladeCount,flowers:g.meadow.wildflowerCount,river:!!g.water,
        flowerVariants:[...new Set(flowers.geometry.attributes.aVariant.array)],
        flowerMaskWidth:flowers.material.uniforms.uMask.value.image.width,
        flowerHeightMin:Math.min(...heights),flowerHeightMax:Math.max(...heights),
        grassRadius:maxRadius(g.meadow.blades.blades),flowerRadius:maxRadius(g.meadow.wildflowers.flowers),
        groundTriangles:ground.index.count/3,groundRadius:ground.boundingSphere.radius,innerFlowers,
        carpetCount:s.carpet.count,carpetRadius:maxRadius(s.carpet),
        trees:!!s.scene.getObjectByName('distant-garden-trees'),
        grassTime:g.meadow.blades.uniforms.uTime.value,
        pausedTime:s.time,photoFog:s.cards[0].mat.fog,
        shaders:s.renderer.info.programs.every(p=>gl.getProgramParameter(p.program,gl.LINK_STATUS))};
    });
    assert.ok(garden,'场景复用花草组件');
    console.log('花园渲染预算：'+JSON.stringify(garden));
    assert.equal(garden.trees,false,'去掉远处块状树丛');
    assert.ok(garden.grassRadius<=13&&garden.flowerRadius<=13,'花草仅分布在紧凑伞下花园');
    assert.ok(garden.blades<=6500&&garden.flowers>=2300&&garden.flowers<=2400,'花朵约翻倍，草叶预算不增加');
    assert.equal(garden.flowerVariants.length,6,'实际生成六种花型');
    assert.equal(garden.flowerMaskWidth,960,'六种花型都有独立的纹理区域');
    assert.ok(garden.flowerHeightMin<.4&&garden.flowerHeightMax>.85&&garden.flowerHeightMax<=1.1,'高低错落且不挡悬挂照片');
    assert.ok(garden.groundTriangles<=256&&garden.groundRadius<=13.01,'移除巨大远景地面');
    assert.ok(garden.innerFlowers>150,'伞下也有花朵，而非只在外圈');
    assert.ok(garden.carpetCount<=2200&&garden.carpetRadius<=3.5,'缩小花瓣毯让出种花空间');
    assert.ok(garden.blades>0&&garden.blades<25000,'草叶有数量预算');assert.ok(garden.flowers>0,'实际生成花丛');
    assert.equal(garden.river,false,'不再生成河流');
    assert.equal(garden.photoFog,false,'户外雾不能使照片泛白');assert.equal(garden.shaders,true,'原版组件着色器在现有Three.js中成功编译');
    assert.equal(garden.grassTime,garden.pausedTime,'花草使用现有场景时钟，减少动态效果时同步静止');
    const chip=f().locator('.chip').first(),label=f().locator('#chip-city-name');
    await chip.hover();
    assert.equal(await label.isVisible(),true,'悬停显示城市名');
    assert.equal(await label.textContent(),'杭州');
    const hint=await label.evaluate(el=>({color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor}));
    assert.equal(hint.color,'rgb(52, 75, 59)','城市提示使用清晰的深松绿');
    assert.equal(hint.background,'rgba(0, 0, 0, 0)','城市提示不再使用遮挡照片的实体框');
    const dotBox=await chip.locator('.dot').boundingBox(),labelBox=await label.boundingBox();
    assert.ok(labelBox.y+labelBox.height<dotBox.y,'城市名位于光点上方');
    assert.ok(Math.abs(labelBox.x+labelBox.width/2-dotBox.x-dotBox.width/2)<2,'城市名与光点居中');
    assert.equal(await chip.getAttribute('title'),null,'不再显示浏览器默认提示');
    assert.equal(await f().locator('#btn-rotate').getAttribute('aria-pressed'),'false','默认不自动旋转');
    await f().waitForFunction(()=>!canopy.scene.flight);
    await f().locator('#btn-rotate').click();
    await f().waitForFunction(()=>canopy.scene.controls.autoRotate);
    const angle=await f().evaluate(()=>canopy.scene.controls.getAzimuthalAngle());
    await f().waitForFunction(a=>Math.abs(canopy.scene.controls.getAzimuthalAngle()-a)>.001,angle);
    const speed=await f().evaluate(()=>canopy.scene.controls.autoRotateSpeed);
    await f().locator('#btn-direction').click();
    assert.equal(await f().evaluate(()=>canopy.scene.controls.autoRotateSpeed),-speed,'切换方向');
    await f().locator('#btn-speed').click();await f().locator('#btn-speed').click();
    assert.ok(Math.abs(await f().evaluate(()=>canopy.scene.controls.autoRotateSpeed))>=Math.abs(speed)*2.99,'三倍速度');
    await f().evaluate(()=>canopy.scene.controls.dispatchEvent({type:'start'}));
    assert.equal(await f().locator('#btn-rotate').getAttribute('aria-pressed'),'false','手动操作暂停旋转');
    await f().locator('#scene').hover({position:{x:10,y:10}});
    assert.equal(await label.isVisible(),false,'移开后隐藏城市名');
    await page.screenshot({path:path.join(folder,'canopy.png')});
    console.log('伞幕本地视觉检查：'+path.join(folder,'canopy.png'));
    await f().locator('#btn-rotate').click();
    await f().locator('#btn-index').click();await f().locator('.index-item').first().click();
    assert.equal(await f().locator('#detail').getAttribute('aria-hidden'),'false');
    assert.equal(await f().locator('#btn-rotate').getAttribute('aria-pressed'),'false','打开大图暂停自动旋转');
    assert.match(await f().locator('#d-title').textContent(),/杭州/);
    for(const selector of ['#story-card','#detail']){
      const theme=await f().locator(selector).evaluate(el=>{
        const s=getComputedStyle(el),rgb=v=>v.match(/[\d.]+/g).slice(0,3).map(Number);
        const lum=v=>{const [r,g,b]=rgb(v).map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
        const a=lum(s.color),b=lum(s.backgroundColor);
        return {background:rgb(s.backgroundColor),contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
      });
      assert.ok(theme.background.every(c=>c>220),'城市照片区和大图区均为暖浅色而非深色底板');
      assert.ok(theme.contrast>=4.5,'浅色面板中的城市文字对比度足够');
    }
    await f().waitForFunction(()=>Math.abs(document.querySelector('#detail').getBoundingClientRect().right-innerWidth)<1);
    await page.screenshot({path:path.join(folder,'canopy-detail.png')});
    assert.ok(await f().locator('#d-img').getAttribute('src').then(src=>src.startsWith('data:image/')));
    await page.setViewportSize({width:390,height:844});
    assert.equal(await f().evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'手机场景和看图面板不横向溢出');
    assert.equal(requests.filter(url=>/^https?:/.test(url)).length,0,'不依赖网络服务或远程默认照片');assert.deepEqual(errors,[]);
    await page.locator('#close').click();assert.equal(await page.locator('iframe').count(),0);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.locator('#open').click();await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow.canopy?.scene?.cards?.every(c=>c.loaded),{},{timeout:60000});
    await f().evaluate(()=>canopy.ready);
    assert.ok(await f().evaluate(()=>canopy.scene.garden.meadow.bladeCount)<garden.blades,'手机初次打开采用更低草叶预算');
    assert.ok(await f().evaluate(()=>canopy.scene.garden.meadow.bladeCount)<=2500,'手机草叶预算不超过2500');
    assert.ok(await f().evaluate(()=>canopy.scene.garden.meadow.wildflowerCount)>=700&&await f().evaluate(()=>canopy.scene.garden.meadow.wildflowerCount)<=800,'手机花朵适度增加但不超过800');
    const paused=await f().evaluate(()=>{const s=canopy.scene;s.setRunning(false);return s.garden.meadow.blades.uniforms.uTime.value;});
    await page.waitForTimeout(150);
    assert.equal(await f().evaluate(()=>canopy.scene.garden.meadow.blades.uniforms.uTime.value),paused,'暂停时花草不另起后台动画');
    await f().evaluate(()=>canopy.scene.setRunning(true));
    await f().waitForFunction(time=>canopy.scene.garden.meadow.blades.uniforms.uTime.value>time,paused);
    await page.keyboard.press('Escape');assert.equal(await page.locator('iframe').count(),0);
    await page.evaluate(()=>{window.fixtureRecords=[];});await page.locator('#open').click();
    await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow.canopy);
    await f().evaluate(()=>window.canopy.ready);
    assert.match(await f().locator('#loader-text').textContent(),/还没有城市照片/);assert.equal(await f().locator('#loader-text').isVisible(),true);
    const contrast=await f().evaluate(()=>{
      const luminance=value=>{const [r,g,b]=value.match(/[\d.]+/g).slice(0,3).map(v=>{v=Number(v)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
      const a=luminance(getComputedStyle(document.querySelector('#loader-text')).color),b=luminance(getComputedStyle(document.querySelector('#loader')).backgroundColor);
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    assert.ok(contrast>=4.5,'浅色背景下加载及空相册提示仍清晰');
    await page.locator('#close').click();
  }finally{await browser.close();}
});
