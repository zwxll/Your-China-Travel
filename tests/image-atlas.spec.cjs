const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function adapter(){const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/image-atlas/data.js'),'utf8'),context);return context.window.TravelImageAtlas;}
const entry=(key,month)=>({city:{cityKey:key,name:key},month});
test('图谱垂直滚轮方向反转，Shift 和横向平移方向不变',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../assets/image-atlas/app.js'),'utf8');
  const wheel=source.split('\n').find(line=>line.startsWith("space.addEventListener('wheel'"));
  const desired={x:0,z:2400};let listener;
  new Function('space','releaseFocus','desired','planes',wheel)({addEventListener:(type,callback)=>{listener=callback}},()=>{},desired,new Map([[2024,-1250],[2025,0]]));
  const turn=(deltaY,deltaX=0,shiftKey=false)=>listener({deltaY,deltaX,shiftKey,preventDefault(){}});
  turn(-100);assert.equal(desired.z,2220,'滚轮向前时相机应接近照片');
  turn(100);assert.equal(desired.z,2400,'滚轮向后时相机应远离照片');
  turn(100,0,true);assert.equal(desired.x,150);assert.equal(desired.z,2400);
  turn(0,20);assert.equal(desired.x,178);assert.equal(desired.z,2400);
});
test('照片显示标题只保留城市，原始 JPG 文件名仍可用于搜索',async()=>{
  const name='coa48afoeca7e4665e1424e97c49aooc.jpg';
  const photos=await adapter().collect([entry('许昌市','2025-01')],async()=>[{id:1,name,dataUrl:'photo'}]);
  assert.equal(photos[0].title,'许昌市');
  assert.equal(photos[0].sourceFile,name);
});
test('年份图谱复用城市照片，重复到访不重复，视频和空记录排除',async()=>{
  const reads=[];const photos=await adapter().collect([entry('甲','2024-01'),entry('甲','2024-08'),entry('乙','')],async key=>{reads.push(key);return key==='甲'?[{id:1,dataUrl:'image'},{id:2,kind:'video',dataUrl:'video'},{id:3,dataUrl:''}]:[];});
  assert.deepEqual(reads,['甲','乙']);assert.equal(photos.length,1);assert.equal(photos[0].year,2024);assert.equal(photos[0].date,'2024');assert.equal(photos[0].dateSource,'city');
});
test('跨年城市按最早到访年份归类，不使用上传 timestamp；手动年份优先',async()=>{
  const api=adapter(),entries=[entry('甲','2024-03'),entry('甲','2023-02'),entry('乙','')];
  const get=async key=>[{id:key==='甲'?1:2,dataUrl:key,timestamp:Date.UTC(2026,1,1)}];
  const photos=await api.collect(entries,get,{});assert.deepEqual(Array.from(photos,p=>p.year),[2023,'年份未确定']);
  assert.equal(photos[0].date,'2023');assert.equal(photos[0].dateSource,'city');
  const manual=await api.collect(entries,get,{'甲:1':2024});assert.equal(manual[0].year,2024);assert.equal(manual[0].dateSource,'manual');
  const cleared=await api.collect([entry('甲','2024-01')],get,{'甲:1':null});assert.equal(cleared[0].year,'年份未确定');
  assert.deepEqual(Array.from(await api.collect([],get)),[]);
});
