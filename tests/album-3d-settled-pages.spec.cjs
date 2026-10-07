const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const dependencies=fs.existsSync(path.join(__dirname,'../assets/vendor/album-3d-src/node_modules/quick_flipbook'))
  ?path.join(__dirname,'../assets/vendor/album-3d-src/node_modules/')
  :'F:/03-agent项目/Zcode/002-Your-China-Travel/assets/vendor/album-3d-src/node_modules/';
const {FlipBook}=require(path.join(dependencies,'quick_flipbook')),THREE=require(path.join(dependencies,'three'));

test('按钮和滚轮启动时帧时间戳早于请求时间，第一帧不能反向翻动旧页',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../assets/vendor/album-3d-src/reader.js'),'utf8');
  const start=source.indexOf('  function animate('),end=source.indexOf('\n  requestRender();',start);
  for(const direction of [1,-1]){
    const flipBook=new FlipBook({flipDuration:.78});
    flipBook.setPages(Array.from({length:20},()=>new THREE.MeshStandardMaterial()));
    flipBook.progress=4;
    direction>0?flipBook.nextPage():flipBook.previousPage();
    let now=4000,continued=0;
    const context=vm.createContext({flipBook,animationFrame:null,previousFrameTime:4000,
      performance:{now:()=>now},applyDragFrame:()=>false,animateEdgePreview:()=>false,
      refreshDirtyPageNormals:()=>{},updateStatus:()=>{},renderer:{render(){}},scene:{},camera:{},
      recordInput:()=>{},isAutoTurning:()=>Math.abs(flipBook.progress-flipBook.currentPage/2)>1e-7,
      continueRendering:()=>continued++});
    vm.runInContext(source.slice(start,end),context);
    vm.runInContext('animate(3882)',context);
    assert.ok(direction*(flipBook.progress-4)>=0,'日志中的负时间差不得让书页先反向翻动');
    assert.ok(continued>0,'第一帧零时间差时仍须等待下一帧，不能停住动画');
    now=4020;vm.runInContext('animate(3902)',context);
    assert.ok(direction*(flipBook.progress-4)>0,'后续帧必须沿按钮目标方向推进');
  }
});

async function controls(){
  const source=fs.readFileSync(path.join(__dirname,'../assets/vendor/album-3d-src/reader.js'),'utf8');
  const drag=await import('../assets/vendor/album-3d-src/drag.js');
  const flipBook=new FlipBook({flipDuration:.78});
  flipBook.setPages(Array.from({length:10},()=>new THREE.MeshStandardMaterial()));
  flipBook.progress=1;
  const context=vm.createContext({flipBook,...drag,ready:true,reducedMotion:false,pointerStart:null,pages:[],lastStatusKey:'',settledPage:2,
    edgePreview:{baseSheet:null,direction:0,amount:0,target:0},EDGE_PREVIEW_AMOUNT:.055,EDGE_PREVIEW_ZONE:28,EDGE_PREVIEW_EPSILON:.0005,
    requestRender:()=>{},recordInput:()=>{},onStatus:()=>{},getBookScreenMetrics:()=>({centerX:500,centerY:400,pageWidth:300,pageHeight:600})});
  vm.runInContext(source.slice(source.indexOf('  function clearEdgePreview('),source.indexOf('  function visibleFacesAt(')),context);
  return {context,flipBook};
}

test('按钮只提交组件翻页命令，不先重置已有书页进度',async()=>{
  for(const command of ['nextPage()','previousPage()']){
    const {context,flipBook}=await controls();
    flipBook.progress=2;
    vm.runInContext('updateEdgePreview({pointerType:"mouse",clientX:800,clientY:400});animateEdgePreview(.1)',context);
    const before=flipBook.progress;
    vm.runInContext(command,context);
    assert.equal(flipBook.progress,before,'点击按钮不能在组件动画前强制回写 progress');
  }
});

test('页码仅在组件完成按钮翻页后同步，不提前显示目标页',async()=>{
  const {context,flipBook}=await controls(),statuses=[];
  context.onStatus=status=>statuses.push(status);
  vm.runInContext('updateStatus();nextPage();updateStatus()',context);
  assert.equal(statuses.at(-1).spread,1,'动画开始时仍显示原跨页');
  flipBook.animate(.2);vm.runInContext('updateStatus()',context);
  assert.equal(statuses.at(-1).spread,1,'动画中不能提前更新页码');
  flipBook.animate(1);vm.runInContext('updateStatus()',context);
  assert.equal(statuses.at(-1).spread,2,'动画完成才同步下一跨页');
  assert.equal(statuses.at(-1).turning,false);
});

test('接近落定时按钮反向启动不能在动画帧之前重算旧页姿态',async()=>{
  for(const command of ['nextPage()','previousPage()']){
    const {context,flipBook}=await controls();
    flipBook.progress=2-1e-8;
    flipBook.currentPage=4;
    const sheets=Array.from(flipBook);
    const before=sheets.map(sheet=>Array.from(sheet.page.geometry.attributes.position.array));
    vm.runInContext(command,context);
    for(let i=0;i<sheets.length;i++)assert.ok(before[i].every((value,k)=>value===sheets[i].page.geometry.attributes.position.array[k]),'提交按钮命令不能提前改动纸页');
    const progress=flipBook.progress;
    flipBook.animate(.016);
    assert.notEqual(flipBook.progress,progress,'组件在下一动画帧仍正常推进');
  }
});

test('正常翻页尚未落定时，不允许连续按钮命令提前启动下一张纸',async()=>{
  const {context,flipBook}=await controls();
  vm.runInContext('nextPage()',context);flipBook.animate(.15);
  const progress=flipBook.progress;
  vm.runInContext('nextPage()',context);
  assert.equal(flipBook.currentPage,4,'上一张未完成时不能提前把目标改为第三个跨页');
  assert.equal(flipBook.progress,progress,'重复按钮不能重置正在翻动的纸页');
});

test('按钮动画第一帧经过页边，不得启动悬停预览或打断当前动画',async()=>{
  const {context,flipBook}=await controls();
  vm.runInContext('nextPage()',context);flipBook.animate(.0002);
  vm.runInContext('updateEdgePreview({pointerType:"mouse",clientX:800,clientY:400});animateEdgePreview(.016)',context);
  const before=flipBook.progress;flipBook.animate(.016);
  assert.ok(flipBook.progress>before,'悬停不能清掉引擎的自动翻页速度');
  assert.equal(context.edgePreview.baseSheet,null,'动画期间不应翘起另一张纸');
});

test('按钮翻页时已翻过去的纸页保持原有形状，不随下一张纸一起翘起',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../assets/vendor/album-3d-src/reader.js'),'utf8');
  const code=source.slice(source.indexOf('  function memoizeSheetDeformation()'),source.indexOf('  function refreshAllPageNormals()'));
  const flipBook=new FlipBook({flipDuration:.78,pageSubdivisions:16});
  flipBook.setPages(Array.from({length:8},()=>new THREE.MeshStandardMaterial()));
  for(const sheet of flipBook)sheet.pageCurve.elevationHeight=.006;
  vm.runInNewContext(code+';memoizeSheetDeformation();',{flipBook,memoizedSheets:new WeakSet(),dirtySheets:new Set()});
  flipBook.progress=3;
  const previousSheet=Array.from(flipBook)[0];
  const turningSheet=Array.from(flipBook)[3];
  const before=Array.from(previousSheet.page.geometry.attributes.position.array);
  const turningBefore=Array.from(turningSheet.page.geometry.attributes.position.array);
  flipBook.nextPage();
  for(let frame=0;frame<20;frame++){
    flipBook.animate(.016);
    const after=previousSheet.page.geometry.attributes.position.array;
    assert.ok(before.every((value,index)=>value===after[index]),'只应改变正在翻动的纸页，而不是上一页的弯曲');
  }
  assert.ok(turningBefore.some((value,index)=>value!==turningSheet.page.geometry.attributes.position.array[index]),'正在翻动的纸页仍须正常变形');
});

test('经过内页后合上封面或封底，所有纸页必须恢复平坦，不能穿透封皮',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../assets/vendor/album-3d-src/reader.js'),'utf8');
  const code=source.slice(source.indexOf('  function memoizeSheetDeformation()'),source.indexOf('  function refreshAllPageNormals()'));
  for(const closed of [0,4]){
    const flipBook=new FlipBook({flipDuration:.78,pageSubdivisions:16});
    flipBook.setPages(Array.from({length:8},()=>new THREE.MeshStandardMaterial()));
    for(const sheet of flipBook)sheet.pageCurve.elevationHeight=.006;
    vm.runInNewContext(code+';memoizeSheetDeformation();',{flipBook,memoizedSheets:new WeakSet(),dirtySheets:new Set()});
    flipBook.progress=2;
    flipBook.currentPage=closed*2;
    flipBook.animate(1);
    for(const sheet of flipBook){
      sheet.page.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(sheet.page);
      assert.ok(box.max.y-box.min.y<.001,'闭合后不应残留高于纸层间距的内页弯曲：'+(box.max.y-box.min.y));
    }
  }
});
