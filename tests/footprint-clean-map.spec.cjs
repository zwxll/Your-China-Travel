const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
function functionSource(name){
  const start=source.indexOf('  function '+name+'(');
  const end=source.indexOf('\n  }',start)+4;
  assert.ok(start>=0&&end>start,name+' exists');
  return source.slice(start,end);
}
function fixture(){
  const classes=new Set(),patches=[];
  const context=vm.createContext({document:{body:{classList:{contains:name=>classes.has(name)}}},
    cityPoints:[{cityKey:'home',name:'家乡',adcode:'360100',value:[116,28]},
      {cityKey:'visited',name:'到访城市',adcode:'330100',value:[120,30]},
      {cityKey:'unvisited',name:'未到访城市',adcode:'410100',value:[113,34]}],
    citiesWithPhotos:new Set(['home','visited']),selectedProvinceName:'浙江省',currentView:'province',
    visitedProvinces:new Set(['浙江省','江西省']),PROVINCE_MAP:{33:'浙江省',36:'江西省',41:'河南省'},
    _cityBordersActive:false,_cityBordersHiddenDuringRoam:false,currentZoom:1.2,
    NORMAL_LABEL_ZOOM_THRESHOLD:3.5,recomputeLabelPositions:null,
    visitedCityBorders:new Set(['360100','330100']),_visitedBorderMapReady:true,
    fpState:null,fpYearState:null,
    myChart:{getOption:()=>({geo:[{zoom:1.2},{},{zoom:1.2,center:[108,35.5]},{}],series:[]}),
      setOption:patch=>patches.push(JSON.parse(JSON.stringify(patch))),dispatchAction:()=>{}},
    provinceOf:code=>({'33':'浙江省','36':'江西省','41':'河南省'}[code.slice(0,2)]),
    visitedNameShouldShow:()=>true,
    chartThemeColors:()=>({selectedArea:'selected',visitedArea:'visited',unvisitedArea:'base',
      selectedBorder:'selected-border',visitedBorder:'visited-border',unvisitedBorder:'base-border',
      visitedCityBorder:'city-border',provinceBorder:'province-border'}),
    getFootprintHome:()=>context.cityPoints[0]
  });
  for(const name of ['updateScatterData','applyProvinceRegionStyles','updateVisitedBorderLayer','fpRefreshMap'])
    vm.runInContext(functionSource(name),context);
  const latest=key=>patches.filter(p=>p[key]).at(-1)[key];
  return {context,classes,patches,latest,run:code=>vm.runInContext(code,context)};
}
test('轨迹底图隐藏所有普通城市数据，刷新后保持干净，退出恢复城市和省份高亮',()=>{
  const f=fixture();
  f.classes.add('footprint-cinematic');f.run('fpRefreshMap()');
  assert.deepEqual(f.latest('series').map(s=>s.data),[[],[],[],[]]);
  f.run('updateScatterData(); applyProvinceRegionStyles(); updateVisitedBorderLayer()');
  assert.deepEqual(f.latest('series').map(s=>s.data),[[],[],[],[]],'重新刷新不能恢复普通城市点');
  const base=f.patches.filter(p=>p.geo?.[0]?.regions).at(-1).geo[0];
  assert.ok(base.regions.every(r=>r.itemStyle.areaColor==='base'&&r.itemStyle.shadowBlur===0));
  assert.equal(base.emphasis.disabled,true,'悬停不能重新点亮省份');
  assert.equal(f.latest('geo')[3].show,false,'尚未到站，不显示原有已到访轮廓');
  f.classes.delete('footprint-cinematic');f.run('fpRefreshMap()');
  assert.deepEqual(f.latest('series').map(s=>s.data.map(d=>d.cityKey)),
    [['unvisited'],['home','visited'],['home','visited'],['home']]);
  const restored=f.patches.filter(p=>p.geo?.[0]?.regions).at(-1).geo[0];
  assert.equal(restored.regions[0].itemStyle.areaColor,'selected');
  assert.equal(restored.regions[1].itemStyle.areaColor,'visited');
  assert.equal(restored.emphasis.disabled,false);
  f.context.currentView='city';f.run('updateVisitedBorderLayer()');
  assert.deepEqual(f.latest('geo')[3].regions.map(r=>r.name),['360100','330100']);
});
test('轨迹只显示本次已到站的城市轮廓，不展示其他到访城市',()=>{
  const f=fixture();f.classes.add('footprint-cinematic');f.context.currentView='city';
  f.context.fpState={route:[{cityKey:'home'},{cityKey:'visited'}],arrived:[]};
  f.run('updateVisitedBorderLayer()');assert.equal(f.latest('geo')[3].show,false);
  f.context.fpState.arrived=[1];f.run('updateVisitedBorderLayer()');
  assert.deepEqual(f.latest('geo')[3].regions.map(r=>r.name),['330100']);
  assert.notEqual(f.latest('geo')[3].regions[0].itemStyle.areaColor,'transparent');
});
test('年份底图只高亮所选年份的轨迹城市轮廓',()=>{
  const f=fixture();f.classes.add('footprint-cinematic');
  f.context.fpYearState={year:'2023',cities:[
    {adcode:'330100',years:['2023']},{adcode:'410100',years:['2024']} ],arrived:[{adcode:'330100'}]};
  f.run('updateVisitedBorderLayer()');
  assert.deepEqual(f.latest('geo')[3].regions.map(r=>r.name),['330100']);
  f.context.fpYearState.year='2024';f.context.fpYearState.arrived=[{adcode:'410100'}];f.run('updateVisitedBorderLayer()');
  assert.deepEqual(f.latest('geo')[3].regions.map(r=>r.name),['410100']);
});
