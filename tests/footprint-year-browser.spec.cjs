const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const year=new Date().getFullYear();
const points=[{cityKey:'home',name:'家乡',value:[100,100],adcode:'360000'},
  {cityKey:'a',name:'城市甲',value:[250,180],adcode:'330000'},
  {cityKey:'b',name:'城市乙',value:[180,300],adcode:'410000'},
  {cityKey:'unknown',name:'未记日期',value:[80,250],adcode:'420000'}];
const metas={home:{},a:{visitMonth:year+'-08',visitMonths:['2023-05',year+'-08',year+'-09']},
  b:{visitMonth:'2023-06',visitMonths:['2023-06'],attractions:[{visitDate:year+'-07-02'}]},unknown:{}};
metas.a.coverImage='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>';

test('年份轨迹从家乡分别连线，跨年去重、全部及城市原回放可切换，手机不溢出',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>route.request().url()==='http://footprint.test/'
      ?route.fulfill({contentType:'text/html',body:source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')})
      :route.abort());
    await page.goto('http://footprint.test/');
    await page.clock.install({time:new Date('2026-10-03T00:00:00Z')});
    await page.clock.pauseAt(new Date('2026-10-03T00:00:01Z'));
    assert.equal(await page.locator('#fpYearModeBtn').count(),1,'应提供按年份切换入口');
    await page.evaluate(({points,metas})=>{
      window.testPoints=points;window.testMetas=metas;
      ['launch-screen','mapLoader'].forEach(id=>document.getElementById(id)?.remove());
      document.getElementById('mapWrap').style.height='700px';
    },{points,metas});
    const dateStart=source.indexOf('  function getVisitMonths('),dateEnd=source.indexOf('  async function getCityMeta(',dateStart);
    const collectStart=source.indexOf('  async function collectTimelineCities('),collectEnd=source.indexOf('  const FOOTPRINT_HOME_KEY=',collectStart);
    const start=collectEnd,end=source.indexOf('  // 年月格式化：',start);
    const mapFunctions=['updateScatterData','applyProvinceRegionStyles','updateVisitedBorderLayer'].map(name=>{
      const from=source.indexOf('  function '+name+'(');return source.slice(from,source.indexOf('\n  }',from)+4);
    }).join('\n');
    await page.evaluate(`
      const $=id=>document.getElementById(id),cityPoints=window.testPoints;
      const citiesWithPhotos=new Set(cityPoints.map(c=>c.cityKey)),photoCountByCity=new Map();
      const mapWrapEl=$('mapWrap'),provinceFocusLayer=$('provinceFocusLayer'),provinceFocusCities=[];
      let currentZoom=1;const currentView='city',selectedProvinceName='',visitedProvinces=new Set();
      const PROVINCE_MAP={},_cityBordersActive=false,_cityBordersHiddenDuringRoam=false;
      const _visitedBorderMapReady=true,visitedCityBorders=new Set(['360000','330000','410000','420000']);
      const NORMAL_LABEL_ZOOM_THRESHOLD=3.5,recomputeLabelPositions=null;
      function chartThemeColors(){return {visitedArea:'#16415d',visitedCityBorder:'#38bdf8'};}
      function visitedNameShouldShow(){return true;}
      const myChart={option:{geo:[{},{},{center:[108,35.5],zoom:1.7},{}],series:[{},{},{},{}]},
        getOption(){return this.option;},setOption(v){for(const key of ['geo','series'])if(v[key])
          v[key].forEach((patch,i)=>this.option[key][i]=Object.assign({},this.option[key][i],patch));},dispatchAction(){},
        convertToPixel(_,value){return value;},on(){}};
      async function getCityMeta(key){return window.testMetas[key]||{};}
      function toast(msg){window.lastToast=msg;}function provinceOf(){return '测试省';}
      function formatMonthShort(v){return v;}function renderStars(){return '';}
      function openCityModal(){}const totalTripKmEl=document.createElement('span');
      ${source.slice(dateStart,dateEnd)}
      ${source.slice(collectStart,collectEnd)}
      ${mapFunctions}
      ${source.slice(start,end)}
      window.fpTest={start:toggleFootprint,stop:fpStopAll,sync:fpSyncGeometry,
        cityState:()=>fpState,yearState:()=>fpYearState,home:setFootprintHome,
        refresh:fpRefreshMap,arrive:fpArrive,map:()=>myChart.option};
    `);
    await page.evaluate(()=>window.fpTest.start());
    assert.equal(await page.locator('#fpHomeOverlay').isVisible(),true,'无家乡先选择');
    await page.locator('#fpHomeCloseBtn').click();
    await page.evaluate(async()=>{window.fpTest.home('home');await window.fpTest.start();});
    const lines=page.locator('.fp-year-route');
    assert.equal(await page.locator('#fpYearStrip button[aria-pressed="true"]').textContent(),'2023','自动从最早年份开始，而不是只展示今年');
    assert.equal(await page.evaluate(()=>window.fpTest.yearState().playing),true);
    assert.equal(await lines.count(),2,'当年的全部辐射路线同时呈现，不逐城释放');
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().geo[3].regions.map(r=>r.name)),['330000','410000'],'每年开始就显示当年城市轮廓，不等待高亮到站');
    assert.ok((await lines.evaluateAll(items=>items.map(el=>el.getAttribute('d')))).every(d=>d.startsWith('M100.0 100.0')),'每条航线独立从家乡出发');
    assert.equal(await page.locator('.fp-year-flow').count(),2,'每条辐射路线均有高亮线');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).count(),0,'到站之前不显示城市名称');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市乙'}).count(),0);
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),0,'年份卡片到站前不出现');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'未记日期'}).count(),0,'未记年份不混入年播放');
    await page.clock.runFor(400);
    const moving=await page.locator('.fp-year-flow').first().evaluate(el=>getComputedStyle(el).strokeDashoffset);
    await page.clock.runFor(200);
    assert.notEqual(await page.locator('.fp-year-flow').first().evaluate(el=>getComputedStyle(el).strokeDashoffset),moving,'高亮段沿完整路线流动');
    await page.clock.runFor(400);
    assert.equal(await page.locator('#fpMemoryCard').isVisible(),false,'年份模式不逐城弹照片卡片');
    assert.equal(await page.locator('#fpPlane').isVisible(),false,'年份模式不逐城飞飞机');
    await page.locator('#fpYearPlayBtn').click();
    const paused=await page.evaluate(()=>JSON.stringify([window.fpTest.yearState().year,window.fpTest.yearState().elapsed]));
    await page.clock.runFor(3000);
    assert.equal(await page.evaluate(()=>JSON.stringify([window.fpTest.yearState().year,window.fpTest.yearState().elapsed])),paused,'暂停期间高亮及年份均停止');
    await page.locator('#fpYearPlayBtn').click();
    await page.clock.runFor(2200);
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).isVisible(),true,'高亮到站后显示名称并留出停留时间');
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),2,'当年全部城市到站后显示各自卡片');
    const cardA=page.locator('#fpCityCards [aria-label="城市甲旅行记录"]');
    assert.equal(await cardA.locator('img').getAttribute('src'),metas.a.coverImage,'使用该城市封面照片');
    assert.equal(await page.locator('#fpCityCards [aria-label="城市乙旅行记录"] .province-map-card-image-empty').count(),1,'无封面城市保留占位卡片');
    await cardA.evaluate(el=>el.setAttribute('data-retained','yes'));
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().geo[3].regions.map(r=>r.name)),['330000','410000']);
    await page.clock.runFor(1000);
    assert.equal(await page.locator('#fpYearStrip button[aria-pressed="true"]').textContent(),String(year),'旧年份播完后自动切换新年份');
    assert.equal(await cardA.getAttribute('data-retained'),'yes','自动跨年不清除或重建上一年卡片');
    await page.clock.runFor(6000);
    assert.equal(await page.evaluate(()=>window.fpTest.yearState().done),true,'最终年份完成后停止，不循环');
    assert.equal(await page.evaluate(()=>window.fpTest.yearState().playing),false);
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),2,'跨年重复城市不重复生成，播放完保留卡片');
    assert.equal(await lines.count(),0,'全部年份结束后清除路线');
    assert.equal(await page.locator('.fp-year-flow').count(),0,'全部年份结束后清除高亮线');
    assert.equal(await page.locator('.fp-stop-dot').count(),2,'累计城市位置保留且去重');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).count(),1,'结束后保留城市名称');
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().geo[3].regions.map(r=>r.name)),['330000','410000'],'结束后保留累计城市轮廓');
    await page.evaluate(()=>window.fpTest.sync());
    assert.equal(await cardA.getAttribute('data-retained'),'yes','缩放重绘保留卡片');
    assert.equal(await lines.count(),0,'结束后缩放重绘不能恢复路线');
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().series.map(s=>s.data)),[[],[],[],[]]);
    await page.evaluate(()=>window.fpTest.refresh());
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().series.map(s=>s.data)),[[],[],[],[]]);
    assert.equal(await page.locator('#fpYearStrip button[aria-pressed="true"]').textContent(),String(year));
    await page.locator('#fpYearPlayBtn').click();
    assert.equal(await lines.count(),2,'重播后恢复最早年份路线');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).count(),0,'重播后名称重新等待到站');
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),0,'重播后卡片重新等待到站');
    const modesBox=await page.locator('.fp-view-controls').boundingBox();
    const statusBox=await page.locator('.fp-status').boundingBox();
    assert.ok(modesBox.x+modesBox.width<=statusBox.x,'切换按钮位于说明左侧');
    assert.ok(Math.abs(modesBox.y+modesBox.height/2-statusBox.y-statusBox.height/2)<2,'切换按钮与说明居中对齐，不单独占一排');
    assert.ok((await page.locator('#footprintPanel').boundingBox()).height<145,'桌面年份控制栏只占两排');
    await page.locator('#fpYearStrip button').filter({hasText:/^2023$/}).click();
    assert.equal(await page.evaluate(()=>window.fpTest.yearState().playing),true,'点选年份后也自动播放');
    await page.locator('#fpYearStrip button').filter({hasText:/^全部$/}).click();
    assert.equal(await lines.count(),3,'未记日期城市只进入全部');
    await page.locator('#fpCityModeBtn').click();
    assert.equal(await lines.count(),0);
    assert.deepEqual(await page.evaluate(()=>window.fpTest.cityState().route.map(c=>c.cityKey)),['home','b','a','unknown']);
    await page.locator('#fpPlayBtn').click();
    assert.equal(await page.evaluate(()=>window.fpTest.cityState().playing),false,'保留原暂停控制');
    assert.equal(await page.evaluate(()=>window.fpTest.map().geo[3].show),false,'城市模式未到站时底图无旧高亮');
    await page.evaluate(()=>window.fpTest.arrive(performance.now()));
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().geo[3].regions.map(r=>r.name)),['410000']);
    assert.equal(await page.locator('#fpMemoryCard').isVisible(),true,'到站照片卡片仍保留');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市乙'}).isVisible(),true,'按城市到站后也显示地图城市名称');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).count(),0);
    await page.locator('#fpYearModeBtn').click();
    assert.equal(await page.evaluate(()=>window.fpTest.yearState().year),'2023');
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>window.fpTest.sync());
    const mobileModes=await page.locator('.fp-view-controls').boundingBox();
    const mobileClose=await page.locator('#fpCloseBtn').boundingBox();
    assert.ok(Math.abs(mobileModes.y+mobileModes.height/2-mobileClose.y-mobileClose.height/2)<2,'手机切换按钮与右侧关闭按钮同一排');
    for(const id of ['fpYearModeBtn','fpCityModeBtn','fpCloseBtn','fpHomeBtn','fpYearStrip']){
      const box=await page.locator('#'+id).boundingBox();
      assert.ok(box&&box.x>=0&&box.x+box.width<=390,id+' 应在手机屏幕内');
    }
    await page.locator('#fpCloseBtn').click();
    assert.equal(await page.locator('#footprintLayer').isVisible(),false);
    assert.equal(await page.locator('#footprintPanel').isVisible(),false);
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),0,'关闭清理所有轨迹卡片');
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().series.map(s=>s.data.length)),[0,4,4,1],'退出恢复已到访城市和家乡');
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().geo[3].regions.map(r=>r.name)),['360000','330000','410000','420000']);
    await page.evaluate(async()=>{
      window.testMetas.a={visitMonths:['2024-05']};window.testMetas.b={visitMonths:['2023-06']};
      await window.fpTest.start();
    });
    assert.equal(await page.locator('#fpYearStrip button[aria-pressed="true"]').textContent(),'2023','没有今年记录也从最早年份播放');
    await page.clock.runFor(4200);
    assert.equal(await page.locator('#fpYearStrip button[aria-pressed="true"]').textContent(),'2024');
    assert.equal(await lines.count(),1,'跨年后只显示当前年份路线');
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().geo[3].regions.map(r=>r.name)),['410000','330000'],'跨年后保留往年轮廓并立即显示当年轮廓');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市乙'}).count(),1,'保留上一年城市名称');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).count(),0);
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),1,'上一年城市卡片保留，新一年卡片等待到站');
    const highlightBefore=await page.locator('.fp-year-flow').first().evaluate(el=>getComputedStyle(el).strokeDashoffset);
    await page.evaluate(()=>window.fpTest.sync());
    assert.equal(await page.locator('.fp-year-flow').first().evaluate(el=>getComputedStyle(el).strokeDashoffset),highlightBefore,'重新投影不重置高亮播放进度');
    await page.clock.runFor(3000);
    assert.deepEqual(await page.evaluate(()=>window.fpTest.map().geo[3].regions.map(r=>r.name)),['410000','330000'],'新一年到站后逐年累积城市轮廓');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).count(),1);
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),2,'不同年份的不同城市卡片累积');
    const cardBoxes=await page.locator('#fpCityCards .fp-arrival-card').evaluateAll(nodes=>nodes.map(n=>{
      const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};
    }));
    assert.ok(cardBoxes.every(r=>r.left>=0&&r.right<=390),'手机卡片不超出地图');
    assert.ok(cardBoxes[0].right<=cardBoxes[1].left||cardBoxes[1].right<=cardBoxes[0].left||cardBoxes[0].bottom<=cardBoxes[1].top||cardBoxes[1].bottom<=cardBoxes[0].top,'城市卡片避让');
    assert.equal(await lines.count(),1,'累积城市不累积路线');
    await page.locator('#fpYearStrip button').filter({hasText:/^2023$/}).click();
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'城市甲'}).count(),0,'回到早年或重播不得带入未来年份城市');
    assert.equal(await page.locator('#fpCityCards .fp-arrival-card').count(),0,'回到最早年份清理未来城市卡片');
    await page.locator('#fpCloseBtn').click();
    await page.clock.runFor(6000);
    assert.equal(await page.locator('#footprintLayer').isVisible(),false,'关闭后不得继续绘图');
    assert.equal(await page.evaluate(()=>window.fpTest.yearState()),null);
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
